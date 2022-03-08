---
layout: post
title:  "Unit testing validators in C#"
date:   2022-03-08 20:00:00 +0100
---

## Intro

From time to time, we write validator classes to validate incoming data into our system.  
You also may want to write unit tests for validators, but we all know writing unit tests
for validators is boring because they are so straightforward.

This is why I am here to give you some ideas on how to reduce boilerplate code.

In our example, we will use **xunit** but the same idea can be used in other frameworks,
but in some cases with compromises.

### Context

**Note**: all code I'll be demonstrating is available in [this git repository](https://gitlab.com/demo-repositories/blog/unittestingvalidators).

In our example, the model class we will be validating is the following:

**CreateCustomerRequest**
```cs
public class CreateCustomerRequest
{
    public string Name { get; set; }
    public int Age { get; set; }
}
```

For our example, we will use the [**FluentValidation**](https://fluentvalidation.net/)
nuget package to write our validator, but the solution could be easily rewritten to
support most means of validation, let it be a framework or your custom solution.

This is the validation logic for our model object:

**CreateCustomerRequestValidator**
```cs
public class CreateCustomerRequestValidator
    : AbstractValidator<CreateCustomerRequest>
{
    public CreateCustomerRequestValidator()
    {
        RuleFor(x => x.Name)
            .NotEmpty();

        RuleFor(x => x.Age)
            .GreaterThanOrEqualTo(18);
    }
}
```

## The usual way

The usual way we would write unit tests is to do something like 
[this](https://gitlab.com/demo-repositories/blog/unittestingvalidators/-/commit/94bb7a6b484276abdbce5ef951ca5e09dae30629):

**CreateCustomerRequestValidatorTests**
```cs
[Theory]
[InlineData(null)]
[InlineData("")]
[InlineData(" ")]
public void Name_cannot_be_empty(string name)
{
    // Arrange
    var request = new CreateCustomerRequest
    {
        Name = name,
        Age = 32,
    };
    var validator = new CreateCustomerRequestValidator();

    // Act
    TestValidationResult<CreateCustomerRequest> result = 
        validator.TestValidate(request);

    // Assert
    result.ShouldHaveValidationErrorFor(x => x.Name);
}

```

Of course, if we wanted perfect test names, we could duplicate this test
to have a distinct `[Fact]` for each parameter or avoid `[InlineData]` in
favor of a more sophisticated way, but let's just accept it the way it is now.

We could also write a similar validator for the `Age` property too, 
and optionally check for the error message, but you get the idea.

## Changing our thinking process

In the mindset we wrote the previous test was:
1. Create the object to be validated, it will be invalid
1. Create the validator
1. Validate
1. Check validation result

**However**, there is a better way to do that by realizing the followings:
1. We want our unit test to check **one thing**
1. The object to be validated is _almost_ identical to a valid object, but it has
exactly one flaw, for which we are writing our unit test for.

## The flipped approach

We can flip our approach to do the following instead:
1. **Create a valid object**
1. **Make the valid object invalid**
1. Do the rest of the unit test (create validator, do validation, check result)

This allows us to **extract the creation of a valid object** too so we prevent duplication.

**But we can do better**: we can even create a test base class which can do the
piece of code that is repeated in all test cases.

### Meet ValidatorTestBase\<TModel\>

We can create a validator test base like the following:

**ValidatorTestBase\<TModel\>**
```cs
public abstract class ValidatorTestBase<TModel>
{
    protected abstract TModel CreateValidObject();

    protected TestValidationResult<TModel> Validate(Action<TModel> mutate)
    {
        var model = CreateValidObject();
        mutate(model);
        
        var validator = CreateValidator();
        
        return validator.TestValidate(model);
    }

    protected abstract IValidator<TModel> CreateValidator();
}
```

And this is how we use it in our test class:
- define a _mutation action_ which is supposed to make the object invalid
- call the base class' `Validate` method
- check the validation result

**CreateCustomerRequestValidatorTests**
```cs
public class CreateCustomerRequestValidatorTests
        : ValidatorTestBase<CreateCustomerRequest>
{
    [Theory]
    [InlineData(null)]
    [InlineData("")]
    [InlineData(" ")]
    public void Name_cannot_be_empty(string name)
    {
        // Arrange
        Action<CreateCustomerRequest> mutation = x => x.Name = name; 

        // Act
        var result = Validate(mutation);

        // Assert
        result.ShouldHaveValidationErrorFor(x => x.Name);
    }
    
    protected override CreateCustomerRequest CreateValidObject()
    {
        return new CreateCustomerRequest
        {
            Name = "John Doe",
            Age = 20,
        };
    }

    protected override IValidator<CreateCustomerRequest> CreateValidator()
    {
        return new CreateCustomerRequestValidator();
    }
}
```

This new approach eliminates the duplicated parts of:
- creating a potentially large object (or object graph) that is _almost_ valid  
(the duplication here are the parts of the object graph that is valid)
- instantiating a validator
- calling the `TestValidate` method

## Further issues

### Validators with dependency

Your validators may have have dependencies, so if that is the case, in the
`CreateValidator` method, you will have to provide those dependencies, most likely
in the form of mocks.

Those mocks can be class fields, which you can initialize in the test's constructor,
and when you have to do some setup or verification, you can do them in the tests.

In case of **xunit**, this is **not** a problem as for each test case the testing
framework creates a new object of the test class, but obviously don't use this
pattern in other frameworks which don't work like this.

Nevertheless, it's not the best pattern to have dependencies in validators so
let's hope this won't be the case.

### Unit testing valid objects

Sure, you will want to write a test case for a completely valid object,
for which the validator should not report any errors; but I intentionally omitted
that test case as most test cases will be testing negative cases.

In a valid test case you can simply define an empty mutation action, and expect
the result to be valid and contain no errors.

### Further reducing boilerplate code

If we further analyze our unit tests, we can see the following structure
in every test case:
1. It has a name, e.g. "Name_cannot_be_null"
1. It has a mutation action
1. It has a validation part

These all can be treated as _data_ for a data-driven test.  
The test base class could contain a `[Theory]` with `[MemberData]` as its
data source, and the data source could come from the inheritors.

This way, an inheritor test class can shrink to an even smaller size,
specifying only the list of (name, mutation, validation) objects.

I will not be demonstrating this as e.g. the solution would be highly dependent
on the given unit test framework (and so far we were mostly independent of it),
but now that you got the idea of how it would work, you can implement it by yourself.

It is also possible to make the `CreateValidator()` method optional (`virtual`) by
giving the `ValidatorTestBase` class a second type parameter:
```cs
public abstract class ValidatorTestBase<TModel, TValidator> 
    where TValidator : IValidator<TModel>, new()
```
This way, if the implementor has a validator with a default constructor, they won't
have to specify the way of validator creation.  
I omitted this part in the example of the previous part because it requires a
second type parameter which seems a bit noisy to me, but if you can live with it,
feel free to use it.
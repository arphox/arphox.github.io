---
layout: post
title:  "How to remove password from pdf file*"
date:   2021-12-02 09:01:26 +0100
---

#### * given you have the password

## Intro

Sometimes we get a password-protected PDF file. We know the password, it's just inconvenient to always enter it when you want to open it, so we may want to remove the password protection.

## The easy way

**Your favorite PDF viewer (or editor) may be able to remove the password**, so if you only need to decrypt only one pdf, start there!  
> If you need a recommendation on a PDF viewer, I recommend PDF-XChange Viewer, it's fast and free.  
> If you want to do that using PDF-XChange Viewer then you can do it by: (Open pdf), File -> Document Properties -> Security (category) -> change Security Method to "No Security" -> OK -> Close dialog -> Save file

However, if you need to decrypt many files at once, keep reading.

## The automated way - QPDF

You can remove password using a command-line tool, [**QPDF**](https://qpdf.sourceforge.io/).  
Don't worry, **no install is required**.

_Note_: We will use Windows 10, but QPDF should be available on other systems too.

## Get QPDF

First, [download it](https://sourceforge.net/projects/qpdf/) then extract it somewhere.  
For example, I extracted it to: `d:\demo\qpdf-10.4.0\`.

## Usage

Open the command line.

Enter: `Q --password=PW --decrypt DC NEW`  
where:
  - `Q`: path to `qpdf.exe`
  - `PW`: the password of the file
  - `DC`: the path of the pdf file to decrypt
  - `NEW`: path to save the output file

So for example, in my case:
`D:\demo\qpdf-10.4.0\bin\qpdf.exe --password="asd" --decrypt "D:\demo\my_encrypted_pdf.pdf" "D:\demo\decrypted.pdf"`

Result: I can find my decrypted (password removed) pdf at `"D:\demo\decrypted.pdf"`.

## Decrypt all files in directory

For advanced users: you can use this Powershell-script to decrypt all files in a directory:
```powershell
# $pdfsDirPath: path to directory containing pdfs to decrypt
#   - decrypted pdfs are put to the \decrypted subfolder here
# $qpdfPath: path to qpdf.exe
# $pdfPassword: password of the pdf files

$pdfsDirPath = "d:\demo\script\pdfs-to-decrypt\"
$qpdfPath = "D:\demo\script\qpdf-10.4.0\bin\qpdf.exe"
$pdfPassword = "asd"

$decryptedPdfDirPath = [System.IO.Path]::Combine($pdfsDirPath, 'decrypted')
[System.IO.Directory]::CreateDirectory($decryptedPdfDirPath)

Get-ChildItem $pdfsDirPath |
ForEach-Object {
    $extension = [System.IO.Path]::GetExtension($_.FullName)
    if ($extension -ne ".pdf") {
        Write-Host Skipping non-pdf file or directory: $_.FullName
        return
    }
    $decryptedPdfPath = [System.IO.Path]::Combine($decryptedPdfDirPath, $_.Name)
    & $qpdfPath --password=$pdfPassword --decrypt $_.FullName $decryptedPdfPath
    Write-Output Decrypted $decryptedPdfPath
}
```

## Troubleshoot
- If something does not work, maybe try the version I used, which is **10.4.0**, or just read the error description 😃
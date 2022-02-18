---
layout: post
title:  "Rider: how to setup non-English spell checking"
date:   2022-02-18 07:00:00 +0100
---

## Intro

If you are working on code that has non-English comments, it is useful to have spell checking for that given language.  
In my case, the language is **Hungarian**, and the IDE is JetBrains **Rider**.  
Today we find out how we can set it up.

## Overview

The tool (plugin) we are going to use has its own dictionary format so we will need a specific kind of dictionary file.  
The process will include installing the plugin we need, downloading the dictionary for the language we want, and add that language as a custom dictionary in Rider.

## Steps

1. Install the [Hunspell](https://plugins.jetbrains.com/plugin/10275-hunspell) plugin (1)
1. Download the Hungarian dictionary from [here](https://github.com/wooorm/dictionaries/tree/main/dictionaries/hu), put the whole directory to some (permanent) space on your drive. (2,3)
1. Go to `Settings -> Editor -> Spelling` in Rider.
1. At _Custom dictionaries_, click the plus (**+**) button.
1. Select the `index.dic` file in the directory you downloaded the dictionary to.
1. Click **Save**.
1. (optional) Restart Rider (4)

### Notes
- (1) It is called **Hun**spell because originally it has been developed for Hungarian **but** it has dictionaries to support many languages.
- (2) You don't specifically need files from _that_ repo; you can use Google to download the dictionary you want but be careful to download them in Hunspell format.
- (3) Note that if you delete or move the directory where the dictionary is, it will probably break the plugin as it won't reach the dictionary.
- (4) After clicking Save Hungarian spell checking started to work however English got buggy, but after an IDE restart it got fixed so I recommend restarting the IDE just to be sure.

## Non-Hungarian

This process **should** work with other languages too if you select a different dictionary file at Step 2.  
For example I tried Spanish too and it worked.
---
title: Spelling in Vi
description: Adding spelling support to my vi configuration
date: 2012-01-27
---

After discovering a number of typos in my `.txt` files, a quick search found this [Vim documentation file on spelling](http://vimdoc.sourceforge.net/htmldoc/spell.html "Vim documentation: spell"). I'll repeat the basics here, see the article for all the details.

Invoke Vi's spelling mode with this command

```vim
:setlocal spell spelllang=en_us
``` 

I used this to enable the Australian English dictionary

```vim
:setlocal spell spelllang=en_au
```
    

Now that words are highlighted, navigate between the highlighted words with:

*   `]s` - find next unknown word
*   `[s` - find previous unknown word

With the cursor over a highlighted word:

*   `z=` - show word replacement suggestions
*   `zg` - add this word to the dictionary (try remembering '**Z**his is **G**ood')
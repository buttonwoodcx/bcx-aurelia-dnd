> We build a full table for the preview, so that all styles would work.

> Fix preview width/height if needed. Beware the difference between jquery `$(el).width()` and `$(el).css('width')`, the previous one always returns the content width, regardless of the value of the CSS `box-sizing` property.

> You can use this technique not only on `<tr>` tag, but also anything else. Refactor your years old css code to fit `bcx-aurelia-dnd` might be too much work, customized preview can help.

That concludes all features of `bcx-aurelia-dnd`.

Next, let's look at a common usage of DnD, already showed in the above `<tr>` example, [re-order a list](#/re-order-list)

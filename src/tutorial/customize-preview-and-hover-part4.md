> We build a full table for the preview, so that all styles would work.

> Fix preview width/height if needed. Beware the difference between jquery `$(el).width()` and `$(el).css('width')`, the previous one always returns the content width, regardless of the value of the CSS `box-sizing` property.

> You can use this technique not only on `<tr>` tag, but also anything else. Refactor your years old css code to fit `bcx-aurelia-dnd` might be too much work, customized preview can help.

## Optional source handler

There is one more option for `addSource()`, you can pass a `handler` element in options. `handler` should be an DOM element within source element, it only limits where the drag can start, doesn't affect how preview was drawn.

> Default preview still clones source element, not handler element.

> Preview still aligns to source element, not handler element.

Here is an example for using special handler for reordering a table.

### (almost deprecated) Deal with `<tr>` preview problem

> Since `bcx-aurelia-dnd` v0.4.0 and `bcx-aurelia-reorderable-repeat` v0.3.1, it ships with some default preview drawers for `<tr>` and `<li>` elements. You rarely need to go down this path to deal with `<tr>` preview.

> The default `<tr>` and `<li>` preview implementation doesn't handle all situations. When the rendered preview doesn't match your expectation, you still need to draw it manually.

`bcx-aurelia-reorderable-repeat` did not hide `bcx-aurelia-dnd`'s limitation on drawing preview.

> To understand this topic, please go through `bcx-aurelia-dnd` [tutorial](#/overview).

To draw a customized preview, use optional attribute "reorderable-dnd-preview". The attribute supports:

* a string like `reorderable-dnd-preview="method"`. The string is the method name on your component. The method will receive the current item (model, not DOM) been dragged, it needs to return a DOM element (unattached to DOM tree) with reasonable size.

* or a full method call like `reorderable-dnd-preview.call="methodInScope(smthInScope, smth2InScope)"`. The evaluated result of the function call must be a DOM element (unattached to DOM tree) with reasonable size.

Here is a rewrite of example #8 "Default preview for `<tr>` with handler".

### Deal with `<tr>` preview problem

`bcx-aurelia-reorderable-repeat` did not hide `bcx-aurelia-dnd`'s limitation on drawing preview.

> To understand this topic, please go through `bcx-aurelia-dnd` [tutorial](#/overview).

> I attempted to add a generic `<tr>` customized preview in `bcx-aurelia-reorderable-repeat`. But it is bit hard to get it right for all use cases, at least for now.

To draw a customized preview, use optional attribute "reorderable-dnd-preview". The attribute supports:

* a string like `reorderable-dnd-preview="method"`. The string is the method name on your component. The method will receive the current item (model, not DOM) been dragged, it needs to return a DOM element (unattached to DOM tree) with reasonable size.

* or a full method call like `reorderable-dnd-preview.call="methodInScope(smthInScope, smth2InScope)"`. The evaluated result of the function call must be a DOM element (unattached to DOM tree) with reasonable size.

Here is a rewrite of example #8 "Customize preview for `<tr>` with handler".

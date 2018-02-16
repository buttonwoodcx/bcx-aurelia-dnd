### Customize item style under drag

If you have not read [tutorial](#/overview) for `bcx-aurelia-dnd`, we recommend you to read it through. If you have not, here are some key information:

* when you drag a item, the "image" floating with you mouse is called `preview`, it's a DOM element (`bcx-aurelia-dnd` cloned from the source element) lives outside of Aurelia's control.

* `bcx-aurelia-reorderable-repeat` hides the algorithm showing in ["(deprecated) re-order a list"](#/re-order-list).

* the original source element (which you started dragging) is still there. `bcx-aurelia-reorderable-repeat` just added a css class `reorderable-repeat-dragging-me` to the element.

> The style defined in class `reorderable-repeat-dragging-me` is just hiding the source element without affecting layout.

```
.reorderable-repeat-dragging-me {
  visibility: hidden;
}
```


To customize the DOM under drag, you can overwrite `.reorderable-repeat-dragging-me` in your style sheet, or use `.reorderable-repeat-dragging-me.your-class` to localize the customization.

Here is a style customized version of previous example.

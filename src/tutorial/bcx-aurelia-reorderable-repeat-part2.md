### Customize item under drag

If you have not read [tutorial](#/overview) for `bcx-aurelia-dnd`, we recommend you to read it through. If you have not, here are some key information:

* when you drag a item, the "image" floating with you mouse is called `preview`, it's a DOM element (`bcx-aurelia-dnd` cloned from the source element) lives outside of Aurelia's control.

* the original source element (which you started dragging) is still here. `bcx-aurelia-reorderable-repeat` just added a css class `reorderable-repeat-dragging-me` to the element.

* `bcx-aurelia-reorderable-repeat` hides the algorithm showing in ["(deprecated) re-order a list"](#/re-order-list).

```
.reorderable-repeat-dragging-me {
  visibility: hidden;
}
```

The style added in class `reorderable-repeat-dragging-me` is just to hide the source element without affecting layout.

To customize the DOM under drag, you can overwrite `.reorderable-repeat-dragging-me` in your style sheet, or use `.reorderable-repeat-dragging-me.your-class` to localize the customization.

Here is a style customized version of previous example.

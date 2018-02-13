## Prevent preview to show some parts

You can mark parts of the source element with class `bcx-dnd-preview-hide` to prevent the part showing up. For instance, mark edit button to hide the button in preview.

> The default style for `bcx-dnd-preview-hide` is `visible: hidden;`, it means the hidden part doesn't affect the layout geometry.

```
.bcx-dnd-preview .bcx-dnd-preview-hide {
  visible: hidden !important;
}
```

That concludes all features of `bcx-aurelia-dnd`.

Next, let's look at a common usage of DnD, already showed in the above `<tr>` example, [re-order a list](#/re-order-list)

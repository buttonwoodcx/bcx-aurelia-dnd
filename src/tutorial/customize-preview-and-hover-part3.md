For "Add Box" and "Add money" buttons, we use `dndPreview()` to customize preview.

> In customized preview mode, `DndService` only sets `left` and `top` on the preview element, not `width` or `height`. Your preview element needs a reasonable size, at least not `{width: 100%; height: 100%;}`.

> By default, preview is aligned to source element's top left corner.

You can center your preview element around mouse position instead of aligning to source element top left corner. `dndService.addSource(this, {centerPreviewToMousePosition: true});`

This `centerPreviewToMousePosition` option works on both default preview and customized preview.

There is one more option you can pass to `addSource()`, that is `hideCursor`, which is to hide cursor during a DnD session.

> Combine option `centerPreviewToMousePosition` with `hideCursor`, you are essentially using `dndPreview()` to draw a cursor replacement! That's what happened behind "Add money" button.

## Style target element based on DnD state

In the above example code, both boxes and container are dnd targets. They got background color and outline change during a DnD session for "add box" or "add money".

Let's have a look on the implementation of box's property `dndCss`.

```javascript
@computedFrom('dnd', 'dnd.model', 'dnd.isProcessing', 'dnd.canDrop', 'dnd.isHoveringShallowly')
get dndCss() {
  if (!this.dnd) return '';
  const {model, isProcessing, canDrop, isHoveringShallowly} = this.dnd;
  if (!isProcessing) return '';
  // no style if moving item
  if (model.type === 'moveItem') return '';
  let css = '';
  if (canDrop) {
    css += 'can-drop';
  } else {
    css += 'can-not-drop';
  }
  if (isHoveringShallowly) css += ' shallow-hover';
  return css;
}
```

It observes `dnd.isProcessing`, `dnd.model`, `dnd.canDrop` and `dnd.isHoveringShallowly`, set the right css class for box element. Thanks for Aurelia, all the style changes are updated automatically during a DnD session.

## Deal with `<tr>` preview problem

We need to create a customized preview for `<tr>` source element. Just wraps it in a `table` (and also `tbody` if needed), sizes it right, you are good to go.

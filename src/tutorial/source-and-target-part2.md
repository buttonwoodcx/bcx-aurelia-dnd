## How preview was drawn

Before we go onto target definition, let's have a look what happened with the preview when you drag a box.

If using native HTML5 DnD API, the preview would be provided by browser automatically, you have little control of its appearance. Instead, as copied from dragula, `DndService` draws the preview "image" by creating a DOM element.

1. first, it clones the source element to a preview element.
2. add css class "bcx-dnd-preview" to the preview element. Most importantly this class sets `position: absolute !important;` on the preview.
3. get calculated page offset and size of source element, apply them to preview's `left,top,width,height` styles. So that preview will appear at the exact same location of source element.
4. append preview element directly to HTML body.

```css
.bcx-dnd-preview {
  position: absolute !important;
  margin: 0 !important;
  z-index: 9999 !important;
  opacity: 0.8;
  box-shadow: 0 0 16px gray;
}
```

> Be clear, preview element lives outside of Aurelia. It's a static snapshot of source element.

> Because preview is directly under HTML body, you need to make sure source element's css class works directly under body. If the source element's css is like `.example-container .example-box {...}`, the preview with class `.example-box` would not look right when `.example-container` is absent. If refactoring your css to fit `bcx-aurelia-dnd` is too much work, you can also [customize preview](#/customize-preview-and-hover).

> `bcx-aurelia-dnd` style sheet (for `.bcx-dnd-preview` and others) was injected to the top of HTML head. You can overwrite them in your style sheet, for instance, overwrite the `opacity` and `box-shadow` on `.bcx-dnd-preview`. You can also apply special style to one type of your preview with `.bcx-dnd-preview.example-box {...}`. Comparing to native HTML5 DnD API, we have much better control on preview.

> You may wonder how would preview on `<tr>` ever work. It would not, `<tr>` would not work out of a table. You will learn how to deal with that in [customize preview](#/customize-preview-and-hover).

## Implement target

While source delegate has a mandatory method `dndModel()`, target delegate has two: `dndCanDrop(model)` and `dndDrop(location)`.

> dndDrop(location) is where you should finally mutate the state of your component.

```javascript
export class Container {
  // ... add/removeTarget in attached/detached
  // ... hook up dndElement in container.html

  dndCanDrop(model) {
    return model.type === 'moveItem';
  }

  dndDrop(location) {
    const {item} = this.dnd.model;
    const {previewElementRect, targetElementRect} = location;
    const newLoc = {
      x: previewElementRect.x - targetElementRect.x,
      y: previewElementRect.y - targetElementRect.y
    };
    item.x = newLoc.x;
    item.y = newLoc.y;

    // move the item to end of array, in order to show it above others
    const idx = this.items.indexOf(item);
    if (idx >= 0) {
      this.items.splice(idx, 1);
      this.items.push(item);
    }
  }
}
```

When a drag started, `DndService` got a model from source element (`dndModel()`), then use the model to ask (only once) every target's `dndCanDrop(model)`, it also injects a special property `dnd` onto target delegate.

* __dnd.isProcessing__, `true` during a DnD session, no matter whether can drop on this target or not.
* __dnd.canDrop__, a boolean, it's the cached result of `dndCanDrop(model)`.
* __dnd.model__, the model of the DnD session, no matter whether can drop on this target or not.
* __dnd.isHoveringShallowly__, `true` when mouse is hovering directly over target element.
* __dnd.isHovering__, `true` when mouse is hovering within target element region.
* all of above have value `undefined` when not in a DnD session.


Only when `canDrop` is true, the target delegate has chance of receiving `dndDrop(location)`. In it, we got the `dnd.model.item`. You also got some location information passed as argument.

There are few objects in location payload.
* __location.mouseStartAt__, drag start mouse location {x, y} (not {left, top}).
* __location.mouseEndAt__, drop end mouse location {x, y} for `dndDrop()`, or current mouse location for `dndHover()`.
* __location.sourceElementRect__, source element location and size {x, y, width, height}.
* __location.previewElementRect__, preview element location and size {x, y, width, height}.
* __location.targetElementRect__, target element location and size {x, y, width, height}.

> All `x` and `y`, are page offset (relative to whole HTML body), not client offset (relative to browser current view-port). Page offset is more stable to use than client offset, especially when there is scrolling or browser zooming.

> For convenience, `previewElementRect` always presents. Even if you turn off the preview (you will see that in [customize preview](#/customize-preview-and-hover)), it still reports location and size as if you were using default preview.

Beware, `sourceElementRect` is not current location of source element. It is a cached location for the source element when DnD session started.

The reason behind this, is that `DndService` doesn't retain the source delegate/element during a DnD session. Even when the source was removed by `removeSource(...)` during a DnD session, `DndService` would not care. `DndService` gets the dnd model, and caches source element location at start of a DnD session, that's the only time it ever uses that source delegate/element.

> In fact, `addSource()`, `removeSource()`, `addTarget()`, `removeTarget()` are all allowed anytime, within or out of a DnD session. `DndService` thrives on dynamic sources and targets. This will likely happen in your app without your notice, we will elaborate on this when examining dndHover.

With that much of coding, we got movable boxes.


## Style source element based on DnD state

There is one more thing we want to fix. During dragging a box, the original source box still presents. How about making it disappear.

```javascript
export class Box {
  //...
  @computedFrom('dndService.isProcessing', 'dndService.model')
  get draggingMe() {
    return this.dndService.isProcessing &&
           this.dndService.model.item === this.item;
  }
}
```

While target delegate got special injected `dnd` property, source delegate got none. But you can observe two properties directly on `dndService` instance: `isProcessing` and `model`.

> `isProcessing` and `model` are exactly same as what target delegate got in `dnd.isProcessing` and `dnd.model`.

> Here we use them to identify I (the source) am under dragging operation.

Now hide the element when dragging me.

```html
<template>
  <require from="./box.css"></require>

  <div
    ref="dndElement"
    class="example-box"
    style.bind="positionCss"
    show.bind="!draggingMe"
  >
    ${item.name}
  </div>
</template>
```

> Notice we use `show.bind`, not `if.bind` here. Aurelia `if.bind` add/remove the element from DOM tree, while `show.bind` simplify toggle css `visibility`. Because we have a reference "dndElement" on this DOM node, we don't want `if.bind` add/remove it, that would skip our `dndService.addSource(...)` and `dndService.removeSource(...)` in component's `attached()` and `detached()` callbacks.

That is the full version of the first example [move object](#/simple).

# DnD Source and Target

Influenced by React DnD, `bcx-aurelia-dnd`'s `DndService` has concept of:

  * __DnD source__, a DOM element that you can drag, plus associated logic.
  * __DnD target__, a DOM element that you can drop to, plus associated logic.

Since the source and target are bounded to DOM element, you need to register and deregister them to `DndService` at the right Aurelia component life-cycle. The common practice is to `addSource`/`addTarget` in `attached()`, and do `removeSource`/`removeTarget` in `detached()`.

Let's look at the first example ["move object"](#/simple), there is a container of three boxes inside. To implement moving box, we register every box as a source which we want to drag, and register the container as the target which will receive a drop callback.

## Implement source

The box component.
```javascript
export class Box {
  //...
  attached() {
    this.dndService.addSource(this);
  }

  detached() {
    this.dndService.removeSource(this);
  }
  //...
}
```

`dndService.addSource(delegate, options)` takes two arguments.

  * The first argument is delegate, which must implement some required logic, most of time you just implement delegate with current component.
  * The second argument is an optional options, we use it to alter default behavior.

The first thing a source delegate needs to provide, is a reference to the DOM element we want to drag. By default, `DndService` uses `delegate.dndElement`. The easiest way to get that reference is to use `ref="dndElement"` in your view template.

```html
<template>
  <require from="./box.css"></require>

  <div
    ref="dndElement"
    class="example-box"
    style.bind="positionCss"
  >
    ${item.name}
  </div>
</template>
```

> When you use `ref="dndElement"` in view template, Aurelia (not `DndService`) creates a property `dndElement` in your component pointing to the DOM element, you can access `this.dndElement` inside your component code.

> Note, `removeSource()` and `removeTarget()` can be called with either delegate object or element object. So in here, `this.dndService.removeSource(this.dndElement)` works too.

Now DOM is hooked up, source delegate needs to provide `dndModel()` callback, it should return a model which describes the meaning of the drag. When `DndService` detected user started a drag, it asks (only once) the source delegate `dndModel()` callback to return a model.

```javascript
export class Box {
  //...
  dndModel() {
    return {
      type: 'moveItem',
      item: this.item
    };
  }
  //...
}
```

> `DndService` has no requirement on the shape of the model. Even if you return `undefined` here, `DndService` would not complain, although there is no practical purpose of returning `undefined`.

> You should make your own convention on the shape of the model. A common practice is to provide a `type` in the model, which you can easily check against in other parts of your app.

Here is what we got so far, movable boxes. There is no effect of dropping it, because we have not registered any DnD target yet.




## DndService API Reference

`DndService` is the single class provided in `bcx-aurelia-dnd`.

> in Aurelia app, use dependency injection to create instance.

> in other app, create a shared instance for the whole app to use.

### DndService Constructor

```javascript
const dndService = new DndService();
```

> instance created without Aurelia Event Aggregator support. Events `'dnd:willStart'`, `'dnd:didStart'`, `'dnd:willEnd'`, `'dnd:willEnd'` would not fire.

```javascript
import {EventAggregator} from 'aurelia-event-aggregator';
const sharedEa = new EventAggregator();
const dndService = new DndService(sharedEa);
```

> instance created with Aurelia Event Aggregator support. Use `sharedEa` to subscribe to events.

## Published events through Aurelia Event Aggregator

> `dnd:willStart`, just before starting of DnD session, all `isProcessing`, `model`, `isHovering` ... are still `undefined`.

> `dnd:didStart`, just after starting of DnD session, all `isProcessing`, `model`, `isHovering` ... are been set. But none of any targets received `dndHover()` / `dndDrop()` callback.

> `dnd:willEnd`, just before end of a DnD session, all `isProcessing`, `model`, `isHovering` ... are still been set. Just before a target (if there is valid one with canDrop:true under the mouse) receives `dndDrop()` callback.

> `dnd:didEnd`, after a DnD session finished. all `isProcessing`, `model`, ... are set to `undefined`. Final `dndDrop()` callback has been fired if there is a valid target.


### dndService.isProcessing

> `true` during a DnD session. `undefined` when not in a DnD session.

### dndService.model

> the `model` object cached from the result of `sourceDelegate.dndModel()`. `undefined` when not in a DnD session.

### dndService.addSource(delegate, options)

> call inside Aurelia component's `attached()` callback.

#### Source delegate

> if `options.element` is absent, `delegate.dndElement` must be a DOM element, used for source element.

> if `options.element` is present, `delegate.dndElement` is ignored.

> `delegate.dndModel()`, mandatory. Called once, when DnD session starts. It needs to return a model describing the meaning of a drag. There is no requirement on the shape of returned model.

> `delegate.dndPreview(model)`, optional. Called once, when DnD session starts. It needs to return a newly created DOM element, with reasonable size, and not yet attached to DOM tree. Input `model` is the cached result of `sourceDelegate.dndModel()`.

> if `options.noPreview` is true, `delegate.dndPreview(model)` is ignored.

#### Source options (optional)

> `options.element`, manually pass a DOM element as source element, instead of default `delegate.dndElement`.

> `options.noPreview`, turn off preview.

> `options.hideCursor`, hide cursor during a DnD session.

> `options.centerPreviewToMousePosition`, center preview to mouse position. Default preview position is aligned to source element top left corner.

### dndService.addTarget(delegate, options)

> call inside Aurelia component's `attached()` callback.

#### Target delegate

> if `options.element` is absent, `delegate.dndElement` must be a DOM element, used for target element.

> if `options.element` is present, `delegate.dndElement` is ignored.

> `delegate.dndCanDrop(model)`, mandatory. Called once, when DnD session starts. Input `model` is the cached result of `sourceDelegate.dndModel()`.

> `delegate.dndDrop(location)`, mandatory. Called once, when DnD session ends (mouse released) on target element and `delegate.dnd.canDrop` is true.

> `delegate.dndHover(location)`, optional. Called every time mouse moves during a DnD session, when `delegate.dnd.canDrop` is true and either `delegate.dnd.isHovering` or `delegate.dnd.isHoveringShallowly` is true.

> When two (or more) target elements overlap, and both have `delegate.dnd.canDrop` true, `dndHover()` could be called on both target delegates at same time, but `dndDrop()` would be only called on the top target.

#### dnd property on target delegate

> `dnd` property was created for every target delegate by `dndService`.

> `delegate.dnd.isProcessing`, exactly same as `dndService.isProcessing`.

> `delegate.dnd.model`, exactly same as `dndService.model`.

> `delegate.dnd.canDrop`, cached result of `delegate.dndCanDrop(model)`. `undefined` when not in a DnD session.

> `delegate.dnd.isHoveringShallowly`, `true` when mouse is hovering directly over target element. `undefined` when not in a DnD session.

> `delegate.dnd.isHovering`, `true` when mouse is hovering within target element region. `undefined` when not in a DnD session.

#### Target options (optional)

> `options.element`, manually pass a DOM element as target element, instead of default `delegate.dndElement`.

#### Location payload for dndHover(location) and dndDrop(location)

> `location.mouseStartAt`, drag start mouse location {x, y} (not {left, top}).

> `location.mouseEndAt`, drop end mouse location {x, y} for `dndDrop()`, or current mouse location for `dndHover()`.

> `location.sourceElementRect`, source element location and size {x, y, width, height}.

> `location.previewElementRect`, preview element location and size {x, y, width, height}.

> `location.targetElementRect`, target element location and size {x, y, width, height}.

> All `x` and `y`, are page offset (relative to whole HTML body), not client offset (relative to browser current view-port). Page offset is more stable to use than client offset, especially when there is scrolling or browser zooming.

> For convenience, `previewElementRect` always presents. Even if you turn off the preview, it still reports location and size as if you were using default preview.

> `sourceElementRect` is not current location of source element. It is a cached location for the source element when DnD session started.

### dndService.removeSource(delegateOrElement)
### dndService.removeTarget(delegateOrElement)

> call inside Aurelia component's `detached()` callback.


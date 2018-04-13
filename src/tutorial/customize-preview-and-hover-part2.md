What happened in above code:

For the source delegate (box), we turned off preview, removed `show.bind="!draggingMe"`.

> You can bring `draggingMe` back, then use it to control the style of dragging box, for instance to adjust `background-color` or `box-shadow` when dragging.

For the target delegate (container),

* in html template, instead of repeat on original items list, we repeat on patched items list, which is the original items patched by intention.
* we capture user intention in `dndHover(location)` callback. Beware, don't mutate the real items list yet. We use temporary property `intention` to save this information.
* we apply the intention in `dndDrop(location)` callback, as app user intended.
* we reset temporary property `intention` before and after a DnD session by subscribing aurelia events `'dnd:willStart'` and `'dnd:didEnd'`.

> When you use `dndHover` to constantly patch original list, depending on how complex the patch is, aurelia repeater might not be able to reuse existing child component, it might destroy old child components and creates new child components. That will trigger multiple add/removeSource/Target through `attached()` and `detached()` callback. `DndService` is totally fine with dynamical changing sources and targets.

## Published events through Aurelia Event Aggregator

During a DnD session, `DndService` publishes four events you can subscribe to.

* __dnd:willStart__, just before starting of DnD session, all `isProcessing`, `model`, `isHovering` ... are still `undefined`.
* __dnd:didStart__, just after starting of DnD session, all `isProcessing`, `model`, `isHovering` ... have been set. But none of any targets received `dndHover()` / `dndDrop()` callback.
* __dnd:willEnd__, just before end of a DnD session, all `isProcessing`, `model`, `isHovering` ... are still set. Just before a target (if there is valid one with canDrop:true under the mouse) receives `dndDrop()` callback.
* __dnd:didEnd__, after a DnD session finished. all `isProcessing`, `model`, ... are set to `undefined`. Final `dndDrop()` callback has been fired if there is a valid target.

You can use them to prepare or cleanup your environment for a DnD session.

> If you want, you can subscribe them in component without a reference to `dndService` instance.

> In the example code above, instead of applying intention in `dndDrop()` callback, you can make empty `dndDrop() {/* no-op */}`, then apply intention in `'dnd:didEnd'` event subscriber before reset intention. The difference is the second solution can respond to drop outside of the target element, it can use last known intention when app user released mouse button outside of the target element.

## Customize preview

Source delegate has an optional callback `dndPreview(model)` to draw customized preview. The input is the model generated by `dndModel()`, the output needs to be a DOM element (not attached to DOM tree yet). We will use jQuery (not required) to easily create a DOM element.

Let's look at the third example [move and add object](#/move-plus-add).
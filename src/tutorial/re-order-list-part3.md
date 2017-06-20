1. We did not register the container as target. Instead, register every list items as both source and target.
2. We use list item as target to only receive `dndHover()` callback, it does nothing in `dndDrop()` callback. The `dndHover()` communicates with container by calling bounded `updateIntention` callback.
3. The container updates intention, then applies the intention in `'dnd:didEnd'` callback.

> Note inside item's `dndHover(location)` , we carefully check half of target element height to avoid some endless swapping of two items. Very similar to what dragula does for re-ordering list.

> All of this complexity is due to isolation. `DndService` doesn't know all those items are created by Aurelia repeater, and Aurelia repeater doesn't know `DndService` tries to order the item list. We will build a customized Aurelia repeater to bridge this gap.

Finally, let's look at [testing](#/testing).

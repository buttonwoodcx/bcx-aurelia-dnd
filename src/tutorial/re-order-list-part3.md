1. We did not register the container as target. Instead, register every list items as both source and target.
2. We use list item as target to only receive `dndHover()` callback, it does nothing in `dndDrop()` callback. The `dndHover()` communicates with container by calling bounded `updateIntention` callback.
3. The container updates intention, then applies the intention in `'dnd:didEnd'` callback.

> Note inside item's `dndHover(location)` , we carefully check half of target element height to avoid some endless swapping of two items. Very similar to what dragula does for re-ordering list.

Finally, let's look at [testing](#/testing).

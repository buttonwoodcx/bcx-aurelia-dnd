> Here we use `reorderable-dnd-preview="rowPreview"`, you can also use `reorderable-dnd-preview.call="rowPreview(item)"`

> Note we use `ref="tableBody"` to get a reference of the tbody element.

### Callback after reordering

Simply use optional attribute "reorderable-after-reordering" to specify a callback. Like "reorderable-dnd-preview", it supports either a string or a full method call.

> When using string, the method will receive the array model that has been reordered.

Here is an example on top of above code. It prints the list after reordering in console.

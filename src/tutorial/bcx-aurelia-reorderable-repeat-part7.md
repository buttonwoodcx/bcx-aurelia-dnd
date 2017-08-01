That's all features of `bcx-aurelia-reorderable-repeat`.

## Limitation

`bcx-aurelia-reorderable-repeat` doesn't support repeat on `template` element.

Following html generates an Aurelia error.
```html
<template reorderable-repeat.for="obj of array">
  <!-- inner html -->
</template>
```

`bcx-aurelia-reorderable-repeat` only supports `Array` model, not `Set`, `Map` or `Object` (The 3 supported by standard Aurelia repeater). We are trying to reorder something, only array makes sense here.

The performance of this implementation is bad, I mean theoretically really bad on DOM. But you would not feel it, since the array you want to reorder is typically not an array of thousands.

The performance hit is not due to `bcx-aurelia-dnd`, it is my understanding on Aurelia's repeater. In order to support reordering duplicated primitive values (like `['one', 'one', 'two']`), I removed all DOM related optimization code from standard repeater (which skips re-rendering when reordering `'one'` and `'one'`). I will definitely revisit the repeater optimization code.

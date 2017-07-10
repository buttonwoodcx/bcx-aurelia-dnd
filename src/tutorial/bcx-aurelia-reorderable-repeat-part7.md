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

The other bad part is I have not written test code yet. I just started looking into how to setup testing Aurelia plugin with DOM. I will fill up this hole in near future, probably using tape instead of jasmine.

For now, happy reordering :-)

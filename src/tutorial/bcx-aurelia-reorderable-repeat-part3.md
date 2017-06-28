```css
.reorderable-repeat-dragging-me.list-item2 {
  visibility: visible; /* unset visibility: hidden */
  color: transparent; /* hide text */
  background: linear-gradient(to right, lightgrey, white, lightgrey);
}
```

> Note in customization, you need to unset `visibility` first.

### Use handler to limit where user can start drag

`bcx-aurelia-dnd` supports optional `handler` option on source delegate to limit where drag can start. In `bcx-aurelia-reorderable-repeat`, you can pass optional attribute "reorderable-dnd-handler-selector" on the repeated DOM to select `handler` for undernearth source delegates (hidden by `bcx-aurelia-reorderable-repeat` implementation).

> "reorderable-dnd-handler-selector" is used on every source elements with `element.querySelector(...)` to find out the handler.

Here we re-implement the `handler` for example #6 "re-order list with unknown item height" with `bcx-aurelia-reorderable-repeat`.

```html
<ul class="list-container">
  <li
    class="list-flex-item has-handler"
    reorderable-repeat.for="item of items"
    reorderable-dnd-handler-selector=".handler"
  >
    <div class="handler"></div>
    <span>${item.value}</span>
  </li>
</ul>

```
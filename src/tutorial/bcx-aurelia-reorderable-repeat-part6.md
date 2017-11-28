With Aurelia, you actually don't need this callback. The generic solution is to use Aurelia `BindingEngine`'s `collectionObserver`. Here is some sample code on how to do that.

```javascript
import {inject, BindingEngine} from 'aurelia-framework';
@inject(BindingEngine)
export class YourComponent {
  items = [ /* ... */ ];

  constructor(bindingEngine) {
    this.bindingEngine = bindingEngine;
  }

  attached() {
    this._subscriber = this.bindingEngine.collectionObserver(this.items).subscribe((changes) => {
      // `this.items` here is the updated array.
      // `changes` is the aurelia collection mutation, if you know what to inspect it.
    });
  }

  detached() {
    this._subscriber.dispose();
  }
}
```

> This solution catches all mutation on `items` array, no matter whether the change is triggered by `reorderable-repeat`.

> For only listening to changes triggered by `reorderable-repeat`, use "reorderable-after-reordering" callback.

### Direction of DOM flow

By default, `bcx-aurelia-reorderable-repeat` thinks your DOM list flows from top to bottom.

If your DOM list flows rather from left to right (or from right to left), you can pass attribute `reorderable-direction="right"` (for flow from left to right) or `reorderable-direction="left"` (for flow from right to left).

> The default value of "reorderable-direction" is "down", means flow from top to bottom.

> There is support of `reorderable-direction="up"` (for flow from bottom to top). If you can do that in your css (I am not sure how to), we support it.

> I attempted to auto-detect the DOM flow. It's bit tricky at least for now. This option might be removed in future, replaced by auto-detection.

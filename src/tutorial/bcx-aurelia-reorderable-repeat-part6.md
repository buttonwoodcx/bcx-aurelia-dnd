### Direction of DOM flow

By default, `bcx-aurelia-reorderable-repeat` thinks your DOM list flows from top to bottom.

If your DOM list flows rather from left to right (or from right to left), you can pass attribute `reorderable-direction="right"` (for flow from left to right) or `reorderable-direction="left"` (for flow from right to left).

> The default value of "reorderable-direction" is "down", means flow from top to bottom.

> There is support of `reorderable-direction="up"` (for flow from bottom to top). If you can do that in your css (I am not sure how to), we support it.

> I attempted to auto-detect the DOM flow. It's bit tricky at least for now. This option might be removed in future, replaced by auto-detection.

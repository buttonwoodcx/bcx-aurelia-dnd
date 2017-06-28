That's all features of `bcx-aurelia-reorderable-repeat`.

## The bad part

All feels magical, right?

Here is the bad part. The performance of this implementation is bad, I mean theoretically really bad on DOM. But you would not feel it, since the array you want to reorder is typically not an array of thousands.

The performance hit is not due to `bcx-aurelia-dnd`, it is my understanding on Aurelia's repeater. I had trouble to understand some details how Aurelia's repeater reuses view, so in order to make `bcx-aurelia-reorderable-repeat` work, I removed all DOM related optimization code from standard repeater. I will definitely revisit the repeater optimization code and bring it back.

The other bad part is I have not written test code yet. I just started looking into how to setup testing Aurelia plugin with DOM. I will fill up this hole in near future.

For now, happy reordering :-)

# bcx-aurelia-dnd

[BUTTONWOODCX™ PTY LTD](http://www.buttonwood.com.au).

Documentation in progress, view [examples](#simple) for now.

## Why bcx-aurelia-dnd was created

When [Aurelia](http://aurelia.io) released v1.0.0 in July 2016, we quickly decided to convert our [Buttonwood Broker](http://www.buttonwood.com.au/products/cloud-broker/cloud-broker/) front-end from React to Aurelia. The whole convertion only took us (one front-end developer, actually) less than three weeks, which tells you how easy Aurelia is.

One obstacle of the re-write is missing drag-and-drop library for our blueprint composer. Previously we were using [React Dnd](http://react-dnd.github.io/react-dnd/), but there is no equivalent in Aurelia. There are plenty DOM based dnd libraries in Javascript world, [dragula](https://bevacqua.github.io/dragula/) is the best in our eyes. We copied dragula code, removed all its DOM mutation code (we don't need that in Aurelia), wrote interface for it to talk with controller layer of MVC, made a working dnd library in one day. `bcx-aurelia-dnd` source code is largely unchanged since that first implementation.

Thanks for Aurelia, `bcx-aurelia-dnd` implementation is very simple. As in v0.2.1, the source code is less than 600 lines of Javascript, even most of it were copied from dragula to handle events and styling. As always, similiar to most libraries, the [source code](https://github.com/buttonwoodcx/bcx-aurelia-dnd) is way shorter than documentation. Pick one to read on :-)

## Why based on dragula, not native HTML5 DnD API

[dragula](https://bevacqua.github.io/dragula/) implements DnD in plain mouse/touch events, not in native HTML5 DnD API. [Here](https://www.danyow.net/drag-and-drop-with-aurelia/) is the place where we were introduced to dragula, it has some links for issues around native HTML5 DnD API. It resonated with our experience on React DnD which uses native HTML5 DnD API. We had issues on nested source/target and some annoying browser behaviour (cursor in IE) in native HTML5 DnD API. None of that affected our dragula based DnD.

Another bonus of dragula, it supports iPad! All examples here works on iPad.

> There is an annoying whole HTML body bouncing effect on iPad. I tried some solutions to disable it in this example repo, but none of them works so far. Even [dragula example page](https://bevacqua.github.io/dragula/) got the same issue.

## Use inside Aurelia app

To start with your Aurelia app.

* For [aurelia-cli](https://github.com/aurelia/cli) user, just do `au install bcx-aurelia-dnd`.
* For app built with jspm/webpack, just install npm package `npm install --save bcx-aurelia-dnd` and add it to your module config file if needed. `bcx-aurelia-dnd` is compiled in umd format (support both AMD and commonjs loader), you should have no trouble to get it working.
* For Typescript user, there is no `.d.ts` file now. We will add the type definition file in future.

There is a single class `DndService` provided by `bcx-aurelia-dnd`. Inject it in your component.

```javascript
import {inject} from 'aurelia-framework';
import {DndService} from 'bcx-aurelia-dnd';

@inject(DndService)
export class YourComponent {
  constructor(dndService) {
    this.dndService = dndService;
  }
}
```

> Here we rely on default behaviour of Aurelia DI (dependency injection). Aurelia DI creates a singleton `dndService` instance for all components to share.

That's all you need to bring `DndService` to an Aurelia component. There is no step to set it up as plugin. Now let's get started to add [source and target](#/tutorial/source-and-target.md).

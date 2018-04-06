# `bcx-aurelia-dnd`

First, If you want to play with the source code of included examples.

```
git clone git@github.com:buttonwoodcx/bcx-aurelia-dnd.git
cd bcx-aurelia-dnd
git checkout origin/gh-pages # it's our GitHub pages. Of course, an Aurelia app.
npm install --global aurelia-cli # if you have not installed aurelia-cli
npm install # or yarn install
au run --watch
```

## How `bcx-aurelia-dnd` was created

In 2016, when we were converting our [Buttonwood Cloud Broker](http://www.buttonwood.com.au/products/cloud-broker/cloud-broker/) front-end from React to Aurelia, one obstacle of the re-write is missing drag-and-drop library for our blueprint composer. Previously we were using [React DnD](http://react-dnd.github.io/react-dnd/), but there is no equivalent in Aurelia. There are plenty DOM based DnD libraries in JavaScript world, [`dragula`](https://bevacqua.github.io/dragula/) is the best in our eyes.

We copied `dragula` code, removed all its DOM mutation code (we don't need that in Aurelia), made a working DnD library in one day. `bcx-aurelia-dnd` source code is largely unchanged since that first implementation.

Thanks for Aurelia, `bcx-aurelia-dnd` implementation is very simple. The source code is less than 700 lines of JavaScript, even most of it were copied from dragula to handle events and styling. As always, similar to most libraries, the [source code](https://github.com/buttonwoodcx/bcx-aurelia-dnd) is way shorter than documentation.

## Why based on `dragula`, not native HTML5 DnD API

[dragula](https://bevacqua.github.io/dragula/) implements DnD in plain mouse/touch events, not in native HTML5 DnD API. [Here](https://www.danyow.net/drag-and-drop-with-aurelia/) is the place where we were introduced to dragula, it has some links for issues around native HTML5 DnD API. It resonated with our experience on React DnD which uses native HTML5 DnD API. We had issues on nested source/target and some annoying browser behavior (cursor in IE) in native HTML5 DnD API. None of that affected our dragula based DnD.

Another bonus of dragula, it supports mobile devices! All examples here works on iPad and phones.

## `bcx-aurelia-dnd` is not a `dragula` wrapper

We use `dragula`'s algorithm to avoid native HTML5 DnD API, we don't inherit or expose any `dragula` API (they don't even exist in our code). We provide API fit in MVC/MVVM natively.

## Related projects

There are few related projects in Aurelia community. List them here for reference.

### [`aurelia-dragula`](https://github.com/michaelmalonenz/aurelia-dragula)

A `dragula` wrapper to provide convenient interface to Aurelia. Handy to existing `dragula` users.

### [`oribella-aurelia-sortable`](https://github.com/oribella/aurelia-sortable)

Based on very interesting [`oribella`](https://github.com/oribella/oribella), can sort list or multiple lists.
### [`aurelia-sortablejs`](https://github.com/eriklieben/aurelia-sortablejs)

Based on [`Sortablejs`](https://github.com/rubaxa/Sortable), can sort list or multiple lists, visually appealing.

## Use inside Aurelia app

To start with your Aurelia app.

> with aurelia-cli, just do `au install bcx-aurelia-dnd`.

> with jspm, do `jspm install npm:bcx-aurelia-dnd`.

> with webpack, do `npm install --save bcx-aurelia-dnd`.

There is a single class `DndService` provided by `bcx-aurelia-dnd`. Inject it to your component.

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

> Here we rely on default behavior of Aurelia DI (dependency injection). Aurelia DI creates a singleton `dndService` instance for all components to share.

> For TypeScript user, have a look at [TypeScript Support](#/typescript-support).

That's all you need to bring `DndService` to an Aurelia component. There is no step to set it up as plugin. Now let's get started to add [source and target](#/source-and-target).

[BUTTONWOODCX™ PTY LTD](http://www.buttonwood.com.au).

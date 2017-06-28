# bcx-aurelia-reorderable-repeat

A customized Aurelia repeater that supports drag & drop reordering automatically.

## Add to your Aurelia app

### Install package
> with aurelia-cli, just do `au import bcx-aurelia-reorderable-repeat`.

> with jspm, do `jspm install npm:bcx-aurelia-reorderable-repeat`.

> with webpack, do `npm install --save bcx-aurelia-reorderable-repeat`.

### Load plugin

In you app main js file, `aurelia.use.plugin('bcx-aurelia-reorderable-repeat');`.

## Usage

Simply use `reorderable-repeat.for="item of items"` in your view template. That's it...

Here is a rewrite of example #5 "re-order list with fixed item height" with `bcx-aurelia-reorderable-repeat`.

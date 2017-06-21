# Testing

## Unit test without view layer in either NodeJS or browser environment

If you do unit test on controller (Aurelia component JS code), mock up `DndService` is easy because of dependency injection.

In this GitHub pages repository, there is some sample test code on the second example ["move object, no preview, use dndHover"](#/simple-move-hover-no-preview).

> Here we use [tape](#/https://github.com/substack/tape) to do unit test in Nodejs environment. To run the test, `npm test`.

> We use tape on all our new front-end projects. Used Jasmine and Mocha before, tape is way easier to maintain because of zero configuration and minimum feature set. Tape got much less features than other test frameworks, which enforces us to write good decoupled code. Please don't use fancy tool like `rewire` or `babel-rewire-plugin`, unless you are using `ReactJS` which you cannot get away with coupling.

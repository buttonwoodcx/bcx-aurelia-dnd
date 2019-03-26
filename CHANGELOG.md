## [1.0.1](https://github.com/buttonwoodcx/bcx-aurelia-dnd/compare/v1.0.0...v1.0.1) (2019-03-26)


### Bug Fixes

* fix event handler remover on IE11 ([5ccabc5](https://github.com/buttonwoodcx/bcx-aurelia-dnd/commit/5ccabc5)), closes [#10](https://github.com/buttonwoodcx/bcx-aurelia-dnd/issues/10)



<a name="1.0.0"></a>
# [1.0.0](https://github.com/buttonwoodcx/bcx-aurelia-dnd/compare/v0.5.0...v1.0.0) (2018-10-04)


### Features

* change output file to cjs format, upgrade to babel7 ([2e04321](https://github.com/buttonwoodcx/bcx-aurelia-dnd/commit/2e04321))



<a name="0.5.0"></a>
# [0.5.0](https://github.com/buttonwoodcx/bcx-aurelia-dnd/compare/v0.4.7...v0.5.0) (2018-08-25)


### Features

* use babel loose mode for faster/smaller code ([feb81cf](https://github.com/buttonwoodcx/bcx-aurelia-dnd/commit/feb81cf))



<a name="0.4.7"></a>
## [0.4.7](https://github.com/buttonwoodcx/bcx-aurelia-dnd/compare/v0.4.6...v0.4.7) (2018-06-26)


### Bug Fixes

* fix error in TypeScript def file ([717a67a](https://github.com/buttonwoodcx/bcx-aurelia-dnd/commit/717a67a)), closes [#4](https://github.com/buttonwoodcx/bcx-aurelia-dnd/issues/4)



<a name="0.4.6"></a>
## [0.4.6](https://github.com/buttonwoodcx/bcx-aurelia-dnd/compare/v0.4.5...v0.4.6) (2018-04-26)


### Features

* preview drawer for unknown HTML tag, improve compatibility of Aurelia custom component ([3752fea](https://github.com/buttonwoodcx/bcx-aurelia-dnd/commit/3752fea))
* update link to newest doc site. ([264aabc](https://github.com/buttonwoodcx/bcx-aurelia-dnd/commit/264aabc))



<a name="0.4.5"></a>
## [0.4.5](https://github.com/buttonwoodcx/bcx-aurelia-dnd/compare/v0.4.4...v0.4.5) (2018-04-24)


### Bug Fixes

* fix reversed logic on background-color fallback. ([8612e9f](https://github.com/buttonwoodcx/bcx-aurelia-dnd/commit/8612e9f))



<a name="0.4.4"></a>
## [0.4.4](https://github.com/buttonwoodcx/bcx-aurelia-dnd/compare/v0.4.3...v0.4.4) (2018-04-24)


### Bug Fixes

* do not fallback background color to white for customised preview. ([c1e8b82](https://github.com/buttonwoodcx/bcx-aurelia-dnd/commit/c1e8b82))



<a name="0.4.3"></a>
## [0.4.3](https://github.com/buttonwoodcx/bcx-aurelia-dnd/compare/v0.4.2...v0.4.3) (2018-03-08)


### Bug Fixes

* fix BABEL_ENV to development to fix npm installation directly from git. ([7af52bd](https://github.com/buttonwoodcx/bcx-aurelia-dnd/commit/7af52bd))



<a name="0.4.2"></a>
## [0.4.2](https://github.com/buttonwoodcx/bcx-aurelia-dnd/compare/v0.4.1...v0.4.2) (2018-02-16)


### Bug Fixes

* display:none; does not work in ol>li preview as I wanted. ([abc2272](https://github.com/buttonwoodcx/bcx-aurelia-dnd/commit/abc2272))



<a name="0.4.1"></a>
## [0.4.1](https://github.com/buttonwoodcx/bcx-aurelia-dnd/compare/v0.4.0...v0.4.1) (2018-02-13)


### Bug Fixes

* fix typo on css visibility. ([45bcd3c](https://github.com/buttonwoodcx/bcx-aurelia-dnd/commit/45bcd3c))



<a name="0.4.0"></a>
# [0.4.0](https://github.com/buttonwoodcx/bcx-aurelia-dnd/compare/v0.3.1...v0.4.0) (2018-02-13)


### Features

* ship default preview drawers for <tr> and <li> tags. ([38443f0](https://github.com/buttonwoodcx/bcx-aurelia-dnd/commit/38443f0))
* support class .bcx-dnd-preview-hide to hide some node in .bcx-dnd-preview. ([ca26b94](https://github.com/buttonwoodcx/bcx-aurelia-dnd/commit/ca26b94))



<a name="0.3.1"></a>
## [0.3.1](https://github.com/buttonwoodcx/bcx-aurelia-dnd/compare/v0.3.0...v0.3.1) (2017-11-08)


### Bug Fixes

* for touchstart, disable html body scroll. ([3682b2c](https://github.com/buttonwoodcx/bcx-aurelia-dnd/commit/3682b2c))


### Features

* use standard-changelog to auto generate changelog. ([c886197](https://github.com/buttonwoodcx/bcx-aurelia-dnd/commit/c886197))



## 0.3.0 - 08/Nov/2017

  * fix missing event callback on touch devices.

## 0.2.6 - 31/Jul/2017

  * add TypeScript support.

## 0.2.5 - 10/Jul/2017

  * fix a stupid bug on index check.

## 0.2.4 - 28/Jun/2017

  * fix preview size when box-sizing is not border-box.

## 0.2.3 - 27/Jun/2017

  * add body margin 0 as css safe guard.

## 0.2.2 - 26/Jun/2017

  * add optional option `handler` for dndSource.

## 0.2.1 - 17/Jun/2017

  * support dynamic target added during a dnd session.

## 0.2.0 - 17/Jun/2017

  * changed location payload: `{mouseStartAt: {x,y}, mouseEndAt: {x,y}, sourceElementRect: {x,y,width,height}, targetElementRect: {x,y,width,height}, previewElementRect: {x,y,width,height}}`.

## 0.1.4 - 17/Jun/2017

  * fix a regression on preview location.

## 0.1.3 - 17/Jun/2017

  * got css class issue. fixed with "!important".

## 0.1.2 - 15/Jun/2017

  * add option hideCursor, centerPreviewToMousePosition.

## 0.1.1 - 15/Jun/2017

  * fix loading issue in nodejs env.

## 0.1.0 - 13/Jun/2017

  * initial open source release of bcx-aurelia-dnd.

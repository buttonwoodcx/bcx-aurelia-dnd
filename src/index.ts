// borrowed many code from https://github.com/bevacqua/dragula.git
import {EventAggregator} from 'aurelia-event-aggregator';
import {trPreview, liPreview, unknownTagPreview, defaultPreview} from './preview-drawers';

interface SourceDelegate {
  dndElement?: Element;
  dndModel(): any;
  dndCanDrag?(): boolean;
  dndPreview?(model: any): Element;
}

interface SourceOptions {
  element?: Element;
  handler?: Element;
  noPreview?: boolean;
  hideCursor?: boolean;
  centerPreviewToMousePosition?: boolean;
}

interface Point {
  readonly x: number;
  readonly y: number;
}

interface Rect {
  readonly x: number;
  readonly y: number;
  readonly width: number;
  readonly height: number;
}

interface DndLocation {
  mouseStartAt: Point;
  mouseEndAt: Point;
  sourceElementRect: Rect;
  previewElementRect: Rect;
  targetElementRect: Rect;
}

declare interface TargetDelegateInjectedDnd {
  isProcessing: boolean;
  model?: any;
  canDrop?: boolean;
  isHovering?: boolean;
  isHoveringShallowly?: boolean;
}

interface TargetDelegate {
  dndElement?: Element;
  dnd?: TargetDelegateInjectedDnd;
  dndCanDrop(model: any): boolean;
  dndDrop(location: DndLocation): void;
  dndHover?(location: DndLocation): void;
}

interface TargetOptions {
  element?: Element;
}

type PreviewDrawer = (element: Element) => Element | void;

interface LandingTargets {
  shallowTarget: DndTarget | void;
  possibleTargets: Array<DndTarget>;
}

// Ideally should be using aurelia-pal, but it doesn't support
// enough DOM features for bcx-aurelia-dnd to work.

// DndService only works in browser.
// code can be loaded in nodejs env, as long as you don't run it.
// for aurelia component testing in nodejs, feed constructor with a mock DndService.

const doc = document;
const documentElement = doc && doc.documentElement;

const css = `
/* bcx-aurelia-dnd styles */

/*
bcx-aurelia-dnd relies on html/body margin 0.
Your css stack should have done this.
Added here as safe guard.
*/
html, body {
  margin: 0;
}

.bcx-dnd-preview {
  position: absolute !important;
  margin: 0 !important;
  z-index: 9999 !important;
  opacity: 0.8;
  box-shadow: 0 0 16px gray;
}

.bcx-dnd-preview .bcx-dnd-preview-hide {
  visibility: hidden !important;
}

.bcx-dnd-hide {
  display: none !important;
}

.bcx-dnd-hide-cursor .bcx-dnd-preview {
  cursor: none !important;
}

.bcx-dnd-unselectable {
  -webkit-user-select: none !important;
  -moz-user-select: none !important;
  -ms-user-select: none !important;
  user-select: none !important;
}
`;

let _stylesInjected = false;

// copied from aurelia-pal-browser
function injectStyles(): void {
  if (_stylesInjected) return;
  _stylesInjected = true;

  const node = doc.createElement('style');
  node.innerHTML = css;
  node.type = 'text/css';

  if (doc.head.childNodes.length > 0) {
    doc.head.insertBefore(node, doc.head.childNodes[0]);
  } else {
    doc.head.appendChild(node);
  }
}

const classes = (function() {
  const cache = {};
  const start = '(?:^|\\s)';
  const end = '(?:\\s|$)';

  function lookupClass(className: string) {
    let cached = cache[className];
    if (cached) {
      cached.lastIndex = 0;
    } else {
      cache[className] = cached = new RegExp(start + className + end, 'g');
    }
    return cached;
  }

  function addClass(el: Element, className: string) {
    const current = el.className;
    if (!current.length) {
      el.className = className;
    } else if (!lookupClass(className).test(current)) {
      el.className += ' ' + className;
    }
  }

  function rmClass(el: Element, className: string) {
    el.className = el.className.replace(lookupClass(className), ' ').trim();
  }
  return {add: addClass, rm: rmClass};
}());

function whichMouseButton(e: MouseEvent | TouchEvent) {
  const te = e as TouchEvent;
  if (te.touches !== undefined) { return te.touches.length; }

  if (e.which !== undefined && e.which !== 0) { return e.which; } // see https://github.com/bevacqua/dragula/issues/261

  const me = e as MouseEvent;
  if (me.buttons !== undefined) { return me.buttons; }
  const button = me.button;
  if (button !== undefined) { // see https://github.com/jquery/jquery/blob/99e8ff1baa7ae341e94bb89c3e84570c7c3ad9ea/src/event.js#L573-L575
    return button & 1 ? 1 : button & 2 ? 3 : (button & 4 ? 2 : 0);
  }
}

function getPageRect(el: Element): Rect {
  const rect = el.getBoundingClientRect();
  return {
    x: rect.left + getScroll('scrollLeft', 'pageXOffset'),
    y: rect.top + getScroll('scrollTop', 'pageYOffset'),
    width: getRectWidth(rect),
    height: getRectHeight(rect)
  };
}

function getScroll(scrollProp: 'scrollLeft' | 'scrollTop', offsetProp: 'pageXOffset' | 'pageYOffset'): number {
  if (typeof window[offsetProp] !== 'undefined') {
    return window[offsetProp];
  }
  if (documentElement.clientHeight) {
    return documentElement[scrollProp];
  }
  return doc.body[scrollProp];
}

function getElementBehindPreview(preview: Element | void, x: number, y: number): Element {
  let className = '';
  if (preview) {
    className = preview.className;
    preview.className += ' bcx-dnd-hide';
  }
  const el = doc.elementFromPoint(x, y);
  // Restore preview
  if (preview) {
    preview.className = className;
  }
  return el;
}

function getRectWidth(rect: DOMRect): number {
  return rect.width || (rect.right - rect.left);
}

function getRectHeight(rect: DOMRect): number {
  return rect.height || (rect.bottom - rect.top);
}

function getParent(el: Element): Element | null {
  if (el.parentNode === doc) return null;
  return el.parentNode as Element;
}

function isInput(el: Element): boolean {
  return el.tagName === 'INPUT' ||
    el.tagName === 'TEXTAREA' ||
    el.tagName === 'SELECT' ||
    isEditable(el as HTMLElement);
}

function isEditable(el: HTMLElement): boolean {
  if (!el) { return false; } // no parents were editable
  if (el.contentEditable === 'false') { return false; } // stop the lookup
  if (el.contentEditable === 'true') { return true; } // found a contentEditable element in the chain
  return isEditable(getParent(el) as HTMLElement); // contentEditable is set to 'inherit'
}

function getEventHost(e: Event) {
  // on touchend event, we have to use `e.changedTouches`
  // see http://stackoverflow.com/questions/7192563/touchend-event-properties
  // see https://github.com/bevacqua/dragula/issues/34
  const te = e as TouchEvent;
  if (te.targetTouches && te.targetTouches.length) {
    return te.targetTouches[0];
  }
  if (te.changedTouches && te.changedTouches.length) {
    return te.changedTouches[0];
  }

  return e;
}

function getCoord (coord: string, e: Event): number {
  const host = getEventHost(e);
  const missMap = {
    pageX: 'clientX', // IE8
    pageY: 'clientY' // IE8
  };
  if (coord in missMap && !(coord in host) && missMap[coord] in host) {
    coord = missMap[coord];
  }
  return host[coord] as number;
}

class DndSource {
  delegate: SourceDelegate;
  element: Element;
  handler: Element | void;
  noPreview: boolean;
  hideCursor: boolean;
  centerPreviewToMousePosition: boolean;

  constructor(delegate: SourceDelegate, options: SourceOptions = {}) {
    if (!delegate) {
      throw new Error("Missing delegate for dnd source.");
    }

    if (typeof delegate.dndModel !== 'function') {
      throw new Error("Missing dndModel() method on dnd source delegate.");
    }

    this.delegate = delegate;

    if (options.element) {
      this.element = options.element;
    } else {
      this.element = delegate.dndElement;
    }

    if (options.handler) {
      if (! (options.handler instanceof Element)) {
        throw new Error("specified handler is not a DOM element");
      }
      this.handler = options.handler;
    } else {
      this.handler = this.element;
    }

    if (! (this.element instanceof Element)) {
      throw new Error("Missing dndElement or options.element on dnd source delegate.");
    }

    this.noPreview = options.noPreview ? true : false;
    this.hideCursor = options.hideCursor ? true : false;
    this.centerPreviewToMousePosition = options.centerPreviewToMousePosition ? true : false;
  }
}

class DndTarget {
  delegate: TargetDelegate;
  element: Element;
  dndHover: void | ((location: DndLocation) => void);

  constructor(delegate: TargetDelegate, options: TargetOptions = {}) {
    if (!delegate) {
      throw new Error("Missing delegate for dnd target.");
    }

    if (typeof delegate.dndCanDrop !== 'function') {
      throw new Error("Missing dndCanDrop() method on delegate.");
    }

    if (typeof delegate.dndDrop !== 'function') {
      throw new Error("Missing dndDrop() method on dnd target delegate.");
    }

    this.delegate = delegate;

    if (options.element) {
      this.element = options.element;
    } else {
      this.element = delegate.dndElement;
    }

    if (!(this.element instanceof Element)) {
      throw new Error("Missing dndElement or options.element on dnd target delegate.");
    }

    if (typeof delegate.dndHover === 'function') {
      this.dndHover = delegate.dndHover.bind(delegate);
      // this.dndHover = _.throttle(delegate.dndHover.bind(delegate), 25);
    }
  }
}

function indexOfElementOrDelegate(array: Array<DndSource | DndTarget>, delegateOrElement: SourceDelegate | TargetDelegate | Element): number {
  const test = (delegateOrElement instanceof Element) ?
               ((o: DndSource | DndTarget) => o.element === delegateOrElement) :
               ((o: DndSource | DndTarget) => o.delegate === delegateOrElement);

  const len = array.length;

  for (let i = 0; i < len; i += 1) {
    if (test(array[i])) return i;
  }

  return -1; // nothing found
}

function indexOfHandler(array: Array<DndSource>, handler: Element) {
  const test = ((o: DndSource) => o.handler === handler);

  const len = array.length;

  for (let i = 0; i < len; i += 1) {
    if (test(array[i])) return i;
  }

  return -1; // nothing found
}

class DndService {
  ea: EventAggregator;
  dndSources: Array<DndSource>;
  dndTargets: Array<DndTarget>;
  previewDrawers: Array<PreviewDrawer>;

  isProcessing: boolean;
  model: any;

  _element: Element | void;
  _grabbed: DndSource | void;
  _moveX: number | void;
  _moveY: number | void;

  _sourceElement: Element | void;
  _sourceElementRect: Rect;
  _offsetX: number | void;
  _offsetY: number | void;
  _noPreview: boolean | void;
  _sourcePreview: Element | void;
  _hideCursor: boolean | void;
  _centerPreviewToMousePosition: boolean | void;
  _preview: Element | void;

  constructor(ea: EventAggregator) {
    this.ea = ea;

    this.dndSources = [];
    this.dndTargets = [];
    this.previewDrawers = [];

    injectStyles();
    this.addPreviewDrawer(defaultPreview);
    this.addPreviewDrawer(unknownTagPreview);
    this.addPreviewDrawer(liPreview);
    this.addPreviewDrawer(trPreview);

    this._grab = this._grab.bind(this);
    this._release = this._release.bind(this);
    this._startBecauseMouseMoved = this._startBecauseMouseMoved.bind(this);
    this._preventGrabbed = this._preventGrabbed.bind(this);
    this._drag = this._drag.bind(this);
    this._esc = this._esc.bind(this);

    // dnd start handler on doc level
    documentElement.addEventListener('mousedown', this._grab);
    documentElement.addEventListener('touchstart', this._grab, {passive: false});

    // dnd end handler for desktop on doc level
    documentElement.addEventListener('mouseup', this._release);
    // dnd end handler for mobile (touch event) on source element
    documentElement.addEventListener('touchend', this._release);
  }

  addPreviewDrawer(drawer: PreviewDrawer): void {
    this.previewDrawers.unshift(drawer);
  }

  addSource(delegate: SourceDelegate, options: SourceOptions = {}): void {
    this.dndSources.push(new DndSource(delegate, options));
  }

  removeSource(delegateOrElement: SourceDelegate | Element): void {
    const idx = indexOfElementOrDelegate(this.dndSources, delegateOrElement);
    if (idx >= 0) {
      this.dndSources.splice(idx, 1);
    }
  }

  addTarget(delegate: TargetDelegate, options: TargetOptions = {}): void {
    delegate.dnd = {
      isProcessing: false
    };
    const dndTarget = new DndTarget(delegate, options);

    // init delegate.dnd if there is a dnd session
    if (this.isProcessing) {
      const canDrop = dndTarget.delegate.dndCanDrop(this.model);
      const dnd = dndTarget.delegate.dnd;
      dnd.canDrop = canDrop;
      dnd.isProcessing = true;
      dnd.model = this.model;
    }

    this.dndTargets.push(dndTarget);
  }

  removeTarget(delegateOrElement: TargetDelegate | Element): void {
    const idx = indexOfElementOrDelegate(this.dndTargets, delegateOrElement);
    if (idx >= 0) {
      const dndTarget = this.dndTargets[idx];
      // if (dndTarget.dndHover) dndTarget.dndHover.cancel();
      dndTarget.delegate.dnd = null;
      this.dndTargets.splice(idx, 1);
    }
  }

  _sourceOf(element: Element): DndSource {
    const idx = indexOfHandler(this.dndSources, element);
    return idx >= 0 ? this.dndSources[idx] : undefined;
  }

  _startListeningEventualMovements(): void {
    documentElement.addEventListener('mousemove', this._startBecauseMouseMoved);
    documentElement.addEventListener('touchmove', this._startBecauseMouseMoved, {passive: false});
    this._element && this._element.addEventListener('touchmove', this._startBecauseMouseMoved, {passive: false});

    // dnd end handler for mobile (touch event) on source element
    this._element && this._element.addEventListener('touchend', this._release, {passive: false});
  }

  _stopListeningEventualMovements(): void {
    documentElement.removeEventListener('mousemove', this._startBecauseMouseMoved);
    documentElement.removeEventListener('touchmove', this._startBecauseMouseMoved);
    this._element && this._element.removeEventListener('touchmove', this._startBecauseMouseMoved);
  }

  _startListeningMovements(): void {
    documentElement.addEventListener('selectstart', this._preventGrabbed); // IE8
    documentElement.addEventListener('click', this._preventGrabbed);

    documentElement.addEventListener('keydown', this._esc);
    documentElement.addEventListener('mousemove', this._drag);
    documentElement.addEventListener('touchmove', this._drag, {passive: false});
    this._element && this._element.addEventListener('touchmove', this._drag, {passive: false});
  }

  _stopListeningMovements(): void {
    documentElement.removeEventListener('selectstart', this._preventGrabbed); // IE8
    documentElement.removeEventListener('click', this._preventGrabbed);

    documentElement.removeEventListener('keydown', this._esc);
    documentElement.removeEventListener('mousemove', this._drag);
    documentElement.removeEventListener('touchmove', this._drag);
    this._element && this._element.removeEventListener('touchmove', this._drag);
    // remove dnd end handler for mobile (touch event) on source element
    this._element && this._element.removeEventListener('touchend', this._release);
  }

  _preventGrabbed(e: MouseEvent | TouchEvent): void {
    if (this._grabbed) {
      e.preventDefault();
    }
  }

  _grab(e: MouseEvent | TouchEvent): void {
    this._moveX = getCoord('clientX', e);
    this._moveY = getCoord('clientY', e);

    const ignore = whichMouseButton(e) !== 1 || e.metaKey || e.ctrlKey;
    if (ignore) {
      return; // we only care about honest-to-god left clicks and touch events
    }
    const element = e.target as Element;
    this._element = element;
    const dndSource = this._startingSource(element);
    if (!dndSource) return;

    this._grabbed = dndSource;
    this._startListeningEventualMovements();

    if (e.type === 'mousedown') {
      if (isInput(element)) { // see also: https://github.com/bevacqua/dragula/issues/208
        (element as HTMLElement).focus(); // fixes https://github.com/bevacqua/dragula/issues/176
      } else {
        e.preventDefault(); // fixes https://github.com/bevacqua/dragula/issues/155
      }
    } else {
      // for touchstart, disable html body scroll
      e.preventDefault();
    }
  }

  _ungrab(): void {
    this._grabbed = undefined;
    this._stopListeningEventualMovements();
    this._stopListeningMovements();
    this._element = undefined;
  }

  _release(e: MouseEvent | TouchEvent): void {
    this._ungrab();
    if (!this.isProcessing) return;

    this.ea && this.ea.publish('dnd:willEnd');

    const {shallowTarget} = this._landingTargets(e);

    if (shallowTarget) {
      shallowTarget.delegate.dndDrop(this._locationInfo(shallowTarget.element, e));
    }

    this._cleanup();

    this.ea && this.ea.publish('dnd:didEnd');
  }

  _startingSource(element: Element): DndSource {
    if (this.isProcessing) {
      return;
    }

    let dndSource: DndSource;
    while (element) {
      if (!element) break;
      const s = this._sourceOf(element);

      if (s && (
        typeof s.delegate.dndCanDrag !== 'function' ||
        s.delegate.dndCanDrag()
      )) {
        dndSource = s;
        break;
      }

      // Try next parent
      element = getParent(element);
    }

    return dndSource;
  }

  _startBecauseMouseMoved(e: MouseEvent | TouchEvent): void {
    if (!this._grabbed) return;

    if (whichMouseButton(e) === 0) {
      this._cleanup();
      return; // when text is selected on an input and then dragged, mouseup doesn't fire. this is our only hope
    }

    const clientX = getCoord('clientX', e);
    const clientY = getCoord('clientY', e);

    // truthy check fixes #239, equality fixes #207
    if (
      clientX !== undefined &&
      clientX === this._moveX &&
      clientY !== undefined &&
      clientY === this._moveY
    ) {
      return;
    }

    // ignoreInputTextSelection
    const elementBehindCursor = doc.elementFromPoint(clientX, clientY);
    if (isInput(elementBehindCursor)) {
      return;
    }

    const grabbed = this._grabbed; // call to _cleanup() unsets _grabbed
    this._stopListeningEventualMovements();
    this._startListeningMovements();
    if (this.isProcessing) this._cleanup();
    this._start(grabbed);

    this._sourceElementRect = getPageRect(this._sourceElement as Element);
    this._offsetX = getCoord('pageX', e) - this._sourceElementRect.x;
    this._offsetY = getCoord('pageY', e) - this._sourceElementRect.y;

    this._renderPreviewImage();
    this._drag(e);
  }

  _start(dndSource: DndSource): void {
    this.ea && this.ea.publish('dnd:willStart');

    this.isProcessing = true;
    this.model = dndSource.delegate.dndModel();

    this._sourceElement = dndSource.element;
    if (dndSource.noPreview) {
      this._noPreview = true;
    } else if (dndSource.delegate.dndPreview) {
      this._sourcePreview = dndSource.delegate.dndPreview(this.model);
    }

    if (!this._noPreview) {
      if (dndSource.hideCursor) {
        this._hideCursor = true;
      }

      if (dndSource.centerPreviewToMousePosition) {
        this._centerPreviewToMousePosition = true;
      }
    }

    this.dndTargets.forEach(dndTarget => {
      const canDrop = dndTarget.delegate.dndCanDrop(this.model);
      const dnd = dndTarget.delegate.dnd;
      dnd.canDrop = canDrop;
      dnd.isProcessing = true;
      dnd.model = this.model;
    });

    this.ea && this.ea.publish('dnd:didStart');
  }

  _cleanup(): void {
    this._ungrab();
    this._removePreviewImage();
    this.isProcessing = undefined;
    this.model = undefined;
    this._sourceElement = undefined;
    this._noPreview = undefined;
    this._hideCursor = undefined;
    this._centerPreviewToMousePosition = undefined;
    this._sourcePreview = undefined;
    this._sourceElementRect = undefined;
    this._offsetX = 0;
    this._offsetY = 0;

    this.dndTargets.forEach(dndTarget => {
      const dnd = dndTarget.delegate.dnd;
      dnd.canDrop = undefined;
      dnd.isProcessing = undefined;
      dnd.isHoveringShallowly = undefined;
      dnd.isHovering = undefined;
      dnd.model = undefined;

      // if turn on debounce
      // if (dndTarget.dndHover) dndTarget.dndHover.cancel();
    });
  }

  _landingTargets(e: MouseEvent | TouchEvent): LandingTargets {
    if (!this.isProcessing) {
      return {shallowTarget: null, possibleTargets: []};
    }

    const clientX = getCoord('clientX', e);
    const clientY = getCoord('clientY', e);

    // TODO possible targets should be sorted based on z-index(if possible)
    // how to get browser's rendering layers of elements?
    // we want to show user visible element on top of the list.
    let possibleTargets = this.dndTargets.filter(dndTarget => {
      if (!dndTarget.delegate.dnd.canDrop) return;

      const clientRect = dndTarget.element.getBoundingClientRect();
      return clientRect.left <= clientX &&
             clientRect.right >= clientX &&
             clientRect.top <= clientY &&
             clientRect.bottom >= clientY;
    });

    let dndTarget: DndTarget | void;
    let element = getElementBehindPreview(this._preview, clientX, clientY);

    while (!dndTarget && element) {
      const idx = indexOfElementOrDelegate(possibleTargets, element);
      if (idx >= 0) {
        dndTarget = possibleTargets[idx];
      } else {
        element = getParent(element);
      }
    }

    if (dndTarget) {
      possibleTargets.splice(possibleTargets.indexOf(dndTarget), 1);
    } else if (possibleTargets.length > 0) {
      [dndTarget, ...possibleTargets] = possibleTargets;
    }

    return {shallowTarget: dndTarget, possibleTargets: possibleTargets};
  }

  _drag(e: MouseEvent | TouchEvent): void {
    if (!this.isProcessing) {
      return;
    }
    e.preventDefault();

    this._updatePreviewLocation(e);

    const {shallowTarget, possibleTargets} = this._landingTargets(e);

    this.dndTargets.forEach(dndTarget => {
      const dnd = dndTarget.delegate.dnd;
      if (!dnd.isProcessing) return;

      if (dndTarget === shallowTarget) {
        dnd.isHoveringShallowly = true;
        dnd.isHovering = true;

        if (dndTarget.dndHover) {
          dndTarget.dndHover(this._locationInfo(dndTarget.element, e));
        }
      } else if (possibleTargets.indexOf(dndTarget) >= 0) {
        dnd.isHoveringShallowly = false;
        dnd.isHovering = true;

        if (dndTarget.dndHover) {
          dndTarget.dndHover(this._locationInfo(dndTarget.element, e));
        }
      } else {
        dnd.isHoveringShallowly = false;
        dnd.isHovering = false;
      }
    });
  }

  _esc(e: KeyboardEvent): void {
    if (!this.isProcessing) {
      return;
    }

    if (e.key === 'Escape') {
      e.preventDefault();
      // cleanup without dndDrop, without dnd:willEnd/dnd:didEnd events.
      this._cleanup();
      // fire up dnd:didCancel
      this.ea && this.ea.publish('dnd:didCancel');
    }
  }

  _updatePreviewLocation(e: MouseEvent | TouchEvent): void {
    if (this._preview) {
      const pageX = getCoord('pageX', e);
      const pageY = getCoord('pageY', e);

      if (this._centerPreviewToMousePosition) {
        const rect = this._preview.getBoundingClientRect();
        const width = getRectWidth(rect);
        const height = getRectHeight(rect);

        // center around mouse position
        (this._preview as HTMLElement).style.left = (pageX - Math.floor(width / 2)) + 'px';
        (this._preview as HTMLElement).style.top = (pageY - Math.floor(height / 2)) + 'px';
      } else {
        // by default align preview to top-left corner of source element
        (this._preview as HTMLElement).style.left = (pageX - (this._offsetX as number)) + 'px';
        (this._preview as HTMLElement).style.top = (pageY - (this._offsetY as number)) + 'px';
      }
    }
  }

  _locationInfo(targetElement: Element, e: MouseEvent | TouchEvent): DndLocation {
    const mouseStartAt = {
      x: this._sourceElementRect.x + (this._offsetX as number),
      y: this._sourceElementRect.y + (this._offsetY as number),
    };

    const pageX = getCoord('pageX', e);
    const pageY = getCoord('pageY', e);
    const mouseEndAt = {x: pageX, y: pageY};

    const targetElementRect = getPageRect(targetElement);

    let previewElementRect: Rect;

    if (this._preview) {
      previewElementRect = getPageRect(this._preview);
    } else {
      // when no preview, assume using normal preview
      previewElementRect = {
        x: pageX - (this._offsetX as number),
        y: pageY - (this._offsetY as number),
        width: this._sourceElementRect.width,
        height: this._sourceElementRect.height
      };
    }

    return {
      mouseStartAt,
      mouseEndAt,
      sourceElementRect: this._sourceElementRect,
      targetElementRect,
      previewElementRect
    };
  }

  _renderPreviewImage(): void {
    if (this._preview) return;
    if (this._noPreview) return;

    const customised = !!this._sourcePreview;

    if (customised) {
      this._preview = this._sourcePreview;
      this._sourcePreview = undefined;
    } else {
      const el = this._sourceElement;
      if (!el) return;

      for (let i = 0; i < this.previewDrawers.length; i++) {
        this._preview = this.previewDrawers[i](el);
        if (this._preview) break;
      }

      if (!this._preview) return;
    }

    classes.add(this._preview as Element, 'bcx-dnd-preview');
    doc.body.appendChild(this._preview as Element);
    classes.add(doc.body, 'bcx-dnd-unselectable');

    if (!customised && getComputedStyle(this._preview as Element).backgroundColor === 'rgba(0, 0, 0, 0)') {
      (this._preview as HTMLElement).style.backgroundColor = 'white';
    }

    if (this._hideCursor) {
      classes.add(doc.body, 'bcx-dnd-hide-cursor');
    }
  }

  _removePreviewImage(): void {
    if (this._preview) {
      classes.rm(doc.body, 'bcx-dnd-unselectable');
      classes.rm(doc.body, 'bcx-dnd-hide-cursor');
      getParent(this._preview).removeChild(this._preview);
      this._preview = null;
    }
  }
}

// Support Aurelia DI
DndService['inject'] = [EventAggregator];

export {DndService};

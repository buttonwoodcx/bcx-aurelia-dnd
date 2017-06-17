// not testing all edge cases in DOM/events, assumes dragula covers them all.
// only test dnd lifecycle.

import test from 'tape';
import $ from 'jquery';
import {EventAggregator} from 'aurelia-event-aggregator';
import {DndService} from '../src/dnd-service';

const doc = document;
const documentElement = doc.documentElement;

let node = doc.createElement('style');
node.innerHTML = `
.test-class {
  display: block;
}
`;
node.type = 'text/css';
doc.head.appendChild(node);

// fix sizing.
const jBody = $('body');
jBody.css('margin', '0');
jBody.css('padding', '0');

const ea = new EventAggregator();
const dndService = new DndService(ea);

// copied from dragula test/lib/events.js
function fireEvent(el, type, options) {
  var o = options || {};
  var e = document.createEvent('Event');
  e.initEvent(type, true, true);
  Object.keys(o).forEach(apply);
  el.dispatchEvent(e);
  function apply (key) {
    e[key] = o[key];
  }
}

function addBox(label, x, y, width, height) {
  const dom = $('<div style="position:absolute;"></div>');
  dom.text(label);
  dom.css('left', x + 'px');
  dom.css('top', y + 'px');
  dom.css('width', width + 'px');
  dom.css('height', height + 'px');

  dom.appendTo('body');
  return dom.get(0);
}

const model1 = () => ({type: 'one', name: 'model1'});
const model2 = () => ({type: 'two', name: 'model2'});

const box_0_0 = addBox('00', 0, 0, 100, 100);
box_0_0.className = 'test-class';
const box_0_1 = addBox('01', 0, 100, 100, 100);
const box_0_2 = addBox('02', 0, 200, 100, 100);
const box_0_3 = addBox('03', 0, 300, 100, 100);

const tbox_big = addBox('tbox_big', 200, 0, 500, 500);
const tbox_small_inner = addBox('tbox_small_inner', 300, 100, 200, 200);
const tbox_big2 = addBox('tbox_big2', 700, 0, 500, 500);

let _track = [];

function track(tracked) { _track.push(tracked); }
function clearTrack() { _track = []; }

function trackEvent(event) {
  track({event, isProcessing: dndService.isProcessing, model: dndService.model});
}

ea.subscribe('dnd:willStart', () => trackEvent('dnd:willStart'));
ea.subscribe('dnd:didStart', () => trackEvent('dnd:didStart'));
ea.subscribe('dnd:willEnd', () => trackEvent('dnd:willEnd'));
ea.subscribe('dnd:didEnd', () => trackEvent('dnd:didEnd'));

const target1 = {
  dndElement: tbox_big,
  dndCanDrop(model) { return model && model.type === 'one'; },
  dndDrop(location) {
    track({
      event: 'drop on tbox_big',
      location,
    });
  },
  dndHover(location) {
    track({
      event: 'hover on tbox_big',
      location,
    });
  }
};

const target2 = {
  dndCanDrop(model) { return true; },
  dndDrop(location) {
    track({
      event: 'drop on tbox_small_inner',
      location,
    });
  },
  dndHover(location) {
    track({
      event: 'hover on tbox_small_inner',
      location,
    });
  }
};

const target3 = {
  dndElement: tbox_big2,
  dndCanDrop(model) { return model && model.type === 'two'; },
  dndDrop(location) {
    track({
      event: 'drop on tbox_big2',
      location,
    });
  },
  dndHover(location) {
    track({
      event: 'hover on tbox_big2',
      location,
    });
  }
};

test('add source', t => {

  t.throws(() => dndService.addSource(), 'missing delegate');
  t.throws(() => dndService.addSource({dndElement: box_0_0}), 'missing dndModel()');
  t.throws(() => dndService.addSource({dndModel: model1}), 'missing dndElement');

  // normal source
  dndService.addSource({dndModel: model1, dndElement: box_0_0});

  // source with element option and noPreview
  dndService.addSource({dndModel: model1}, {element: box_0_1, noPreview: true});

  // source with customised preview
  dndService.addSource({
    dndModel: model2,
    dndElement: box_0_2,
    dndPreview: (model) => {
      const dom = $('<div></div>');
      dom.text(model.name);
      dom.css('width', '50px');
      dom.css('height', '40px');
      return dom.get(0);
    }
  });

  // source with customised preview, centerPreviewToMousePosition
  dndService.addSource({
    dndModel: model2,
    dndElement: box_0_3,
    dndPreview: (model) => {
      const dom = $('<div></div>');
      dom.text('+');
      dom.css('width', '20px');
      dom.css('height', '20px');
      return dom.get(0);
    }
  }, {centerPreviewToMousePosition: true, hideCursor: true});

  t.end();
});

test('add target', t => {

  t.throws(() => dndService.addTarget(), 'missing delegate');
  t.throws(() => dndService.addTarget({dndElement: tbox_big}), 'missing dndCanDrop() and dndDrop()');
  t.throws(() => dndService.addTarget({dndDrop: () => 1, dndCanDrop: () => true}), 'missing dndElement');
  t.throws(() => dndService.addTarget({dndElement: tbox_big, dndCanDrop: () => true}), 'missing dndDrop()');
  t.throws(() => dndService.addTarget({dndElement: tbox_big, dndDrop: () => 1}), 'missing dndCanDrop()');

  // normal target, can drop type 'one'
  dndService.addTarget(target1);

  // overlapped target with element option, can drop type 'one' and 'two'
  dndService.addTarget(target2, {element: tbox_small_inner});

  // target can drop type 'two'
  dndService.addTarget(target3);

  t.end();
});

test('all targets have empty dnd property', t => {

  t.notOk(dndService.isProcessing);
  t.notOk(dndService.model);

  t.notOk(target1.dnd.isProcessing);
  t.notOk(target1.dnd.isHoveringShallowly);
  t.notOk(target1.dnd.isHovering);
  t.notOk(target1.dnd.canDrop);
  t.notOk(target1.dnd.model);

  t.notOk(target2.dnd.isProcessing);
  t.notOk(target2.dnd.isHoveringShallowly);
  t.notOk(target2.dnd.isHovering);
  t.notOk(target2.dnd.canDrop);
  t.notOk(target2.dnd.model);

  t.notOk(target3.dnd.isProcessing);
  t.notOk(target3.dnd.isHoveringShallowly);
  t.notOk(target3.dnd.isHovering);
  t.notOk(target3.dnd.canDrop);
  t.notOk(target3.dnd.model);
  t.end();
});

test('drag type one, draw preview, drop on nothing', t => {
  const m = {type: 'one', name: 'model1'};

  fireEvent(box_0_0, 'mousedown', {which: 1, clientX: 10, clientY: 20});

  // only mouse down, not yet dnd;
  t.notOk(dndService.isProcessing);
  t.notOk(dndService.model);

  t.deepEqual(_track, []);

  // first small movement, this is where dnd starts
  fireEvent(documentElement, 'mousemove', {which: 1, clientX: 11, clientY: 20});

  // moved mouse, dnd starts
  t.ok(dndService.isProcessing);
  t.deepEqual(dndService.model, m);

  t.ok(target1.dnd.isProcessing);
  t.notOk(target1.dnd.isHoveringShallowly);
  t.notOk(target1.dnd.isHovering);
  t.ok(target1.dnd.canDrop);
  t.deepEqual(target1.dnd.model, m);

  t.ok(target2.dnd.isProcessing);
  t.notOk(target2.dnd.isHoveringShallowly);
  t.notOk(target2.dnd.isHovering);
  t.ok(target2.dnd.canDrop);
  t.deepEqual(target2.dnd.model, m);

  t.ok(target3.dnd.isProcessing);
  t.notOk(target3.dnd.isHoveringShallowly);
  t.notOk(target3.dnd.isHovering);
  t.notOk(target3.dnd.canDrop);
  t.deepEqual(target3.dnd.model, m);

  const preview = $('.bcx-dnd-preview');
  t.equal(preview.length, 1);
  t.equal(preview.css('left'), '0px'); // initial position of preview
  t.equal(preview.css('top'), '0px');

  t.deepEqual(_track, [
    { event: 'dnd:willStart', isProcessing: undefined, model: undefined },
    { event: 'dnd:didStart', isProcessing: true, model: { name: 'model1', type: 'one' } }
  ]);

  clearTrack();

  // following movement re-position preview.
  fireEvent(documentElement, 'mousemove', {which: 1, clientX: 15, clientY: 20});
  t.equal(preview.css('left'), '4px'); // moved 4px to the right
  t.equal(preview.css('top'), '0px');

  t.deepEqual(_track, []);

  fireEvent(documentElement, 'mouseup', {which: 1, clientX: 15, clientY: 20});

  t.equal($('.bcx-dnd-preview').length, 0);

  t.deepEqual(_track, [
    { event: 'dnd:willEnd', isProcessing: true, model: { name: 'model1', type: 'one' } },
    { event: 'dnd:didEnd', isProcessing: undefined, model: undefined },
  ]);

  clearTrack();

  t.end();
});

test('drag type one, hover over 2 targets, drop on inner target', t => {
  const m = {type: 'one', name: 'model1'};

  fireEvent(box_0_0, 'mousedown', {which: 1, clientX: 10, clientY: 20});
  t.notOk($('body').hasClass('bcx-dnd-hide-cursor'));

  // first small movement, this is where dnd starts
  fireEvent(documentElement, 'mousemove', {which: 1, clientX: 11, clientY: 20});
  const preview = $('.bcx-dnd-preview');
  // following movement re-position preview.
  fireEvent(documentElement, 'mousemove', {which: 1, clientX: 15, clientY: 20});
  t.equal(preview.css('left'), '4px'); // moved 4px to the right
  t.equal(preview.css('top'), '0px');
  t.notOk($('body').hasClass('bcx-dnd-hide-cursor'));

  clearTrack();

  // hover over tbox_big move 250px to the right, move 10px down
  fireEvent(documentElement, 'mousemove', {which: 1, clientX: 261, clientY: 30});
  t.equal(preview.css('left'), '250px'); // moved 4px to the right
  t.equal(preview.css('top'), '10px');

  t.ok(target1.dnd.isProcessing);
  t.ok(target1.dnd.isHoveringShallowly);
  t.ok(target1.dnd.isHovering);
  t.ok(target1.dnd.canDrop);
  t.deepEqual(target1.dnd.model, m);

  t.ok(target2.dnd.isProcessing);
  t.notOk(target2.dnd.isHoveringShallowly);
  t.notOk(target2.dnd.isHovering);
  t.ok(target2.dnd.canDrop);
  t.deepEqual(target2.dnd.model, m);

  t.ok(target3.dnd.isProcessing);
  t.notOk(target3.dnd.isHoveringShallowly);
  t.notOk(target3.dnd.isHovering);
  t.notOk(target3.dnd.canDrop);
  t.deepEqual(target3.dnd.model, m);

  t.deepEqual(_track, [
    {
      event: 'hover on tbox_big',
      location: {
        mouseEndAt: { x: 261, y: 30 },
        mouseStartAt: { x: 11, y: 20 },
        previewElementRect: { x: 250, y: 10, width: 100, height: 100 },
        sourceElementRect: { x: 0, y: 0, width: 100, height: 100 },
        targetElementRect: { x: 200, y: 0, width: 500, height: 500 }
      }
    }
  ]);

  clearTrack();

  // hover over tbox_small_inner move 300px to the right, move 110px down
  fireEvent(documentElement, 'mousemove', {which: 1, clientX: 311, clientY: 130});
  t.equal(preview.css('left'), '300px'); // moved 4px to the right
  t.equal(preview.css('top'), '110px');

  t.notOk(target1.dnd.isHoveringShallowly);
  t.ok(target1.dnd.isHovering);

  t.ok(target2.dnd.isHoveringShallowly);
  t.ok(target2.dnd.isHovering);

  t.notOk(target3.dnd.isHoveringShallowly);
  t.notOk(target3.dnd.isHovering);

  t.deepEqual(_track, [
    {
      event: 'hover on tbox_big',
      location: {
        mouseEndAt: { x: 311, y: 130 },
        mouseStartAt: { x: 11, y: 20 },
        previewElementRect: { x: 300, y: 110, width: 100, height: 100 },
        sourceElementRect: { x: 0, y: 0, width: 100, height: 100 },
        targetElementRect: { x: 200, y: 0, width: 500, height: 500 }
      }
    },
    {
      event: 'hover on tbox_small_inner',
      location: {
        mouseEndAt: { x: 311, y: 130 },
        mouseStartAt: { x: 11, y: 20 },
        previewElementRect: { x: 300, y: 110, width: 100, height: 100 },
        sourceElementRect: { x: 0, y: 0, width: 100, height: 100 },
        targetElementRect: { x: 300, y: 100, width: 200, height: 200 }
      }
    }
  ]);

  clearTrack();

  // drop on tbox_small_inner
  fireEvent(documentElement, 'mouseup', {which: 1, clientX: 311, clientY: 130});

  // finished
  t.notOk(dndService.isProcessing);
  t.notOk(dndService.model);

  t.notOk(target1.dnd.isProcessing);
  t.notOk(target1.dnd.isHoveringShallowly);
  t.notOk(target1.dnd.isHovering);
  t.notOk(target1.dnd.canDrop);
  t.notOk(target1.dnd.model);

  t.notOk(target2.dnd.isProcessing);
  t.notOk(target2.dnd.isHoveringShallowly);
  t.notOk(target2.dnd.isHovering);
  t.notOk(target2.dnd.canDrop);
  t.notOk(target2.dnd.model);

  t.notOk(target3.dnd.isProcessing);
  t.notOk(target3.dnd.isHoveringShallowly);
  t.notOk(target3.dnd.isHovering);
  t.notOk(target3.dnd.canDrop);
  t.notOk(target3.dnd.model);

  t.deepEqual(_track, [
    { event: 'dnd:willEnd', isProcessing: true, model: { name: 'model1', type: 'one' } },
    {
      event: 'drop on tbox_small_inner',
      location: {
        mouseEndAt: { x: 311, y: 130 },
        mouseStartAt: { x: 11, y: 20 },
        previewElementRect: { x: 300, y: 110, width: 100, height: 100 },
        sourceElementRect: { x: 0, y: 0, width: 100, height: 100 },
        targetElementRect: { x: 300, y: 100, width: 200, height: 200 }
      }
    },
    { event: 'dnd:didEnd', isProcessing: undefined, model: undefined }
  ]);

  clearTrack();
  t.end();
});

test('drag type one with no preview, drop on outer target', t => {
  const m = {type: 'one', name: 'model1'};

  fireEvent(box_0_1, 'mousedown', {which: 1, clientX: 10, clientY: 120});
  // first small movement, this is where dnd starts
  fireEvent(documentElement, 'mousemove', {which: 1, clientX: 11, clientY: 120});
  const preview = $('.bcx-dnd-preview');
  t.equal(preview.length, 0);
  // following movement re-position preview.
  fireEvent(documentElement, 'mousemove', {which: 1, clientX: 15, clientY: 120});

  clearTrack();

  // hover over tbox_big move 250px to the right, move 10px down
  fireEvent(documentElement, 'mousemove', {which: 1, clientX: 261, clientY: 130});

  t.ok(target1.dnd.isProcessing);
  t.ok(target1.dnd.isHoveringShallowly);
  t.ok(target1.dnd.isHovering);
  t.ok(target1.dnd.canDrop);
  t.deepEqual(target1.dnd.model, m);

  t.ok(target2.dnd.isProcessing);
  t.notOk(target2.dnd.isHoveringShallowly);
  t.notOk(target2.dnd.isHovering);
  t.ok(target2.dnd.canDrop);
  t.deepEqual(target2.dnd.model, m);

  t.ok(target3.dnd.isProcessing);
  t.notOk(target3.dnd.isHoveringShallowly);
  t.notOk(target3.dnd.isHovering);
  t.notOk(target3.dnd.canDrop);
  t.deepEqual(target3.dnd.model, m);

  t.deepEqual(_track, [
    {
      event: 'hover on tbox_big',
      location: {
        mouseEndAt: { x: 261, y: 130 },
        mouseStartAt: { x: 11, y: 120 },
        previewElementRect: { x: 250, y: 110, width: 100, height: 100 },
        sourceElementRect: { x: 0, y: 100, width: 100, height: 100 },
        targetElementRect: { x: 200, y: 0, width: 500, height: 500 }
      }
    }
  ]);

  clearTrack();

  // drop on tbox_big
  fireEvent(documentElement, 'mouseup', {which: 1, clientX: 261, clientY: 130});

  // finished
  t.notOk(dndService.isProcessing);
  t.notOk(dndService.model);

  t.notOk(target1.dnd.isProcessing);
  t.notOk(target1.dnd.isHoveringShallowly);
  t.notOk(target1.dnd.isHovering);
  t.notOk(target1.dnd.canDrop);
  t.notOk(target1.dnd.model);

  t.notOk(target2.dnd.isProcessing);
  t.notOk(target2.dnd.isHoveringShallowly);
  t.notOk(target2.dnd.isHovering);
  t.notOk(target2.dnd.canDrop);
  t.notOk(target2.dnd.model);

  t.notOk(target3.dnd.isProcessing);
  t.notOk(target3.dnd.isHoveringShallowly);
  t.notOk(target3.dnd.isHovering);
  t.notOk(target3.dnd.canDrop);
  t.notOk(target3.dnd.model);

  t.deepEqual(_track, [
    { event: 'dnd:willEnd', isProcessing: true, model: { name: 'model1', type: 'one' } },
    {
      event: 'drop on tbox_big',
      location: {
        mouseEndAt: { x: 261, y: 130 },
        mouseStartAt: { x: 11, y: 120 },
        previewElementRect: { x: 250, y: 110, width: 100, height: 100 },
        sourceElementRect: { x: 0, y: 100, width: 100, height: 100 },
        targetElementRect: { x: 200, y: 0, width: 500, height: 500 }
      }
    },
    { event: 'dnd:didEnd', isProcessing: undefined, model: undefined }
  ]);

  clearTrack();
  t.end();
});

test('drag type two with customised preview, drop on invalid target', t => {
  const m = {type: 'two', name: 'model2'};

  fireEvent(box_0_2, 'mousedown', {which: 1, clientX: 10, clientY: 220});
  // first small movement, this is where dnd starts
  fireEvent(documentElement, 'mousemove', {which: 1, clientX: 11, clientY: 220});
  const preview = $('.bcx-dnd-preview');
  t.equal(preview.length, 1);
  t.equal(preview.css('left'), '0px');
  t.equal(preview.css('top'), '200px');
  t.equal(preview.css('width'), '50px', 'customised width, not source element width.');
  t.equal(preview.css('height'), '40px', 'customised height, not source element height.');


  // following movement re-position preview.
  fireEvent(documentElement, 'mousemove', {which: 1, clientX: 15, clientY: 220});
  t.equal(preview.css('left'), '4px');
  t.equal(preview.css('top'), '200px');

  clearTrack();

  // hover over tbox_big move 250px to the right, move 10px down
  fireEvent(documentElement, 'mousemove', {which: 1, clientX: 261, clientY: 230});

  t.ok(target1.dnd.isProcessing);
  t.notOk(target1.dnd.isHoveringShallowly, 'no hover on invalid target');
  t.notOk(target1.dnd.isHovering, 'no hover on invalid target');
  t.notOk(target1.dnd.canDrop);
  t.deepEqual(target1.dnd.model, m);

  t.ok(target2.dnd.isProcessing);
  t.notOk(target2.dnd.isHoveringShallowly);
  t.notOk(target2.dnd.isHovering);
  t.ok(target2.dnd.canDrop);
  t.deepEqual(target2.dnd.model, m);

  t.ok(target3.dnd.isProcessing);
  t.notOk(target3.dnd.isHoveringShallowly);
  t.notOk(target3.dnd.isHovering);
  t.ok(target3.dnd.canDrop);
  t.deepEqual(target3.dnd.model, m);

  t.deepEqual(_track, []);

  clearTrack();

  // drop on tbox_big, invalid target
  fireEvent(documentElement, 'mouseup', {which: 1, clientX: 261, clientY: 230});

  // finished
  t.notOk(dndService.isProcessing);
  t.notOk(dndService.model);

  t.notOk(target1.dnd.isProcessing);
  t.notOk(target1.dnd.isHoveringShallowly);
  t.notOk(target1.dnd.isHovering);
  t.notOk(target1.dnd.canDrop);
  t.notOk(target1.dnd.model);

  t.notOk(target2.dnd.isProcessing);
  t.notOk(target2.dnd.isHoveringShallowly);
  t.notOk(target2.dnd.isHovering);
  t.notOk(target2.dnd.canDrop);
  t.notOk(target2.dnd.model);

  t.notOk(target3.dnd.isProcessing);
  t.notOk(target3.dnd.isHoveringShallowly);
  t.notOk(target3.dnd.isHovering);
  t.notOk(target3.dnd.canDrop);
  t.notOk(target3.dnd.model);

  t.deepEqual(_track, [
    { event: 'dnd:willEnd', isProcessing: true, model: { name: 'model2', type: 'two' } },
    { event: 'dnd:didEnd', isProcessing: undefined, model: undefined }
  ], 'no drop recorded');

  clearTrack();
  t.end();
});

test('drag type two with customised preview, hideCursor, centerPreviewToMousePosition, drop on target', t => {
  const m = {type: 'two', name: 'model2'};

  fireEvent(box_0_3, 'mousedown', {which: 1, clientX: 20, clientY: 320});

  t.notOk($('body').hasClass('bcx-dnd-hide-cursor'));
  // first small movement, this is where dnd starts
  fireEvent(documentElement, 'mousemove', {which: 1, clientX: 21, clientY: 320});
  const preview = $('.bcx-dnd-preview');
  t.equal(preview.length, 1);
  t.equal(preview.css('left'), '11px');
  t.equal(preview.css('top'), '310px');
  t.equal(preview.css('width'), '20px', 'customised width, not source element width.');
  t.equal(preview.css('height'), '20px', 'customised height, not source element height.');

  t.ok($('body').hasClass('bcx-dnd-hide-cursor'));

  // following movement re-position preview.
  fireEvent(documentElement, 'mousemove', {which: 1, clientX: 25, clientY: 320});
  t.equal(preview.css('left'), '15px');
  t.equal(preview.css('top'), '310px');

  clearTrack();

  //hover over tbox_big2 move 700px to the right, move 10px down
  fireEvent(documentElement, 'mousemove', {which: 1, clientX: 721, clientY: 330});

  t.ok(target1.dnd.isProcessing);
  t.notOk(target1.dnd.isHoveringShallowly);
  t.notOk(target1.dnd.isHovering);
  t.notOk(target1.dnd.canDrop);
  t.deepEqual(target1.dnd.model, m);

  t.ok(target2.dnd.isProcessing);
  t.notOk(target2.dnd.isHoveringShallowly);
  t.notOk(target2.dnd.isHovering);
  t.ok(target2.dnd.canDrop);
  t.deepEqual(target2.dnd.model, m);

  t.ok(target3.dnd.isProcessing);
  t.ok(target3.dnd.isHoveringShallowly);
  t.ok(target3.dnd.isHovering);
  t.ok(target3.dnd.canDrop);
  t.deepEqual(target3.dnd.model, m);

  t.deepEqual(_track, [
    {
      event: 'hover on tbox_big2',
      location: {
        mouseEndAt: { x: 721, y: 330 },
        mouseStartAt: { x: 21, y: 320 },
        previewElementRect: { x: 711, y: 320, width: 20, height: 20 },
        sourceElementRect: { x: 0, y: 300, width: 100, height: 100 },
        targetElementRect: { x: 700, y: 0, width: 500, height: 500 }
      }
    }
  ]);

  clearTrack();

  //drop on tbox_big2
  fireEvent(documentElement, 'mouseup', {which: 1, clientX: 721, clientY: 330});

  // finished
  t.notOk(dndService.isProcessing);
  t.notOk(dndService.model);

  t.notOk(target1.dnd.isProcessing);
  t.notOk(target1.dnd.isHoveringShallowly);
  t.notOk(target1.dnd.isHovering);
  t.notOk(target1.dnd.canDrop);
  t.notOk(target1.dnd.model);

  t.notOk(target2.dnd.isProcessing);
  t.notOk(target2.dnd.isHoveringShallowly);
  t.notOk(target2.dnd.isHovering);
  t.notOk(target2.dnd.canDrop);
  t.notOk(target2.dnd.model);

  t.notOk(target3.dnd.isProcessing);
  t.notOk(target3.dnd.isHoveringShallowly);
  t.notOk(target3.dnd.isHovering);
  t.notOk(target3.dnd.canDrop);
  t.notOk(target3.dnd.model);

  t.deepEqual(_track, [
    { event: 'dnd:willEnd', isProcessing: true, model: { name: 'model2', type: 'two' } },
    {
      event: 'drop on tbox_big2',
      location: {
        mouseEndAt: { x: 721, y: 330 },
        mouseStartAt: { x: 21, y: 320 },
        previewElementRect: { x: 711, y: 320, width: 20, height: 20 },
        sourceElementRect: { x: 0, y: 300, width: 100, height: 100 },
        targetElementRect: { x: 700, y: 0, width: 500, height: 500 }
      }
    },
    { event: 'dnd:didEnd', isProcessing: undefined, model: undefined }
  ]);

  clearTrack();
  t.end();
});
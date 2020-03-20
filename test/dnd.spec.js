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

const box_0_0 = addBox('00', 0, 0, 50, 50);
box_0_0.className = 'test-class'; // make sure .bcx-dnd-hide change 'display' to 'none'
const box_0_1 = addBox('01', 0, 50, 50, 50);
const box_0_2 = addBox('02', 0, 100, 50, 50);
const box_0_3 = addBox('03', 0, 150, 50, 50);

const box_0_4 = addBox('04', 0, 200, 50, 50);
const box_0_4_handler = $('<div style="position:absolute;width:10px;height:10px;left:5px;bottom:5px"></div>').get(0);
box_0_4.appendChild(box_0_4_handler);

const box_0_5 = addBox('05', 0, 250, 50, 50);

let box_content_box = $(`
<div style="position:absolute;left:0;top:250px;width:25px;height:25px;margin:10px;padding:5px;border:1px solid black;box-sizing:content-box;"></div>
`);
box_content_box.appendTo('body');
box_content_box =  box_content_box.get(0);

let box_border_box = $(`
<div style="position:absolute;left:50px;top:250px;width:25px;height:25px;margin:10px;padding:5px;border:1px solid black;box-sizing:border-box;"></div>
`);
box_border_box.appendTo('body');
box_border_box =  box_border_box.get(0);


const tbox_big = addBox('tbox_big', 100, 0, 250, 250);
const tbox_small_inner = addBox('tbox_small_inner', 150, 50, 100, 100);
const tbox_big2 = addBox('tbox_big2', 350, 0, 250, 250);
const tbox_small_inner2 = addBox('tbox_small_inner2', 400, 50, 100, 100);

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

const target4 = {
  dndElement: tbox_small_inner2,
  dndCanDrop(model) { return model && model.type === 'two'; },
  dndDrop(location) {
    track({
      event: 'drop on tbox_small_inner2',
      location,
    });
  },
  dndHover(location) {
    track({
      event: 'hover on tbox_small_inner2',
      location,
    });
  }
};

test('add source', t => {

  t.throws(() => dndService.addSource(), 'missing delegate');
  t.throws(() => dndService.addSource({dndElement: box_0_0}), 'missing dndModel()');
  t.throws(() => dndService.addSource({dndModel: model1}), 'missing dndElement');
  t.throws(() => dndService.addSource({dndModel: model1, dndElement: box_0_0}, {handler: 1}), 'invalid handler');

  // normal source
  dndService.addSource({dndModel: model1, dndElement: box_0_0});

  // source with element option and noPreview
  dndService.addSource({dndModel: model1}, {element: box_0_1, noPreview: true});

  // source with customised preview and dndCanDrag
  dndService.addSource({
    dndModel: model2,
    dndElement: box_0_2,
    dndPreview: (model) => {
      const dom = $('<div></div>');
      dom.text(model.name);
      dom.css('width', '25px');
      dom.css('height', '20px');
      return dom.get(0);
    },
    dndCanDrag: () => true
  });

  // source with customised preview, centerPreviewToMousePosition
  dndService.addSource({
    dndModel: model2,
    dndElement: box_0_3,
    dndPreview: (model) => {
      const dom = $('<div></div>');
      dom.text('+');
      dom.css('width', '10px');
      dom.css('height', '10px');
      return dom.get(0);
    }
  }, {centerPreviewToMousePosition: true, hideCursor: true});

  // source with handler, a dndPreview returns undefined
  dndService.addSource({dndModel: model2, dndElement: box_0_4, dndPreview: () => undefined}, {handler: box_0_4_handler});

  // source with content-box box-sizing
  dndService.addSource({dndModel: model1, dndElement: box_content_box});
  // source with border-box box-sizing
  dndService.addSource({dndModel: model1, dndElement: box_border_box});


  // source with customised dndCanDrag
  dndService.addSource({
    dndModel: model1,
    dndElement: box_0_5,
    dndCanDrag: () => false
  });

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

  fireEvent(box_0_0, 'mousedown', {which: 1, clientX: 5, clientY: 10});

  // only mouse down, not yet dnd;
  t.notOk(dndService.isProcessing);
  t.notOk(dndService.model);

  t.deepEqual(_track, []);

  // first small movement, this is where dnd starts
  fireEvent(documentElement, 'mousemove', {which: 1, clientX: 6, clientY: 10});

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
  fireEvent(documentElement, 'mousemove', {which: 1, clientX: 8, clientY: 10});
  t.equal(preview.css('left'), '2px'); // moved 2px to the right
  t.equal(preview.css('top'), '0px');

  t.deepEqual(_track, []);

  fireEvent(documentElement, 'mouseup', {which: 1, clientX: 8, clientY: 10});

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

  fireEvent(box_0_0, 'mousedown', {which: 1, clientX: 5, clientY: 10});
  t.notOk($('body').hasClass('bcx-dnd-hide-cursor'));

  // first small movement, this is where dnd starts
  fireEvent(documentElement, 'mousemove', {which: 1, clientX: 6, clientY: 10});
  const preview = $('.bcx-dnd-preview');
  // following movement re-position preview.
  fireEvent(documentElement, 'mousemove', {which: 1, clientX: 8, clientY: 10});
  t.equal(preview.css('left'), '2px'); // moved 2px to the right
  t.equal(preview.css('top'), '0px');
  t.notOk($('body').hasClass('bcx-dnd-hide-cursor'));

  clearTrack();

  // hover over tbox_big move 125px to the right, move 5px down
  fireEvent(documentElement, 'mousemove', {which: 1, clientX: 131, clientY: 15});
  t.equal(preview.css('left'), '125px');
  t.equal(preview.css('top'), '5px');

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
        mouseEndAt: { x: 131, y: 15 },
        mouseStartAt: { x: 6, y: 10 },
        previewElementRect: { x: 125, y: 5, width: 50, height: 50 },
        sourceElementRect: { x: 0, y: 0, width: 50, height: 50 },
        targetElementRect: { x: 100, y: 0, width: 250, height: 250 }
      }
    }
  ]);

  clearTrack();

  // hover over tbox_small_inner move 150px to the right, move 55px down
  fireEvent(documentElement, 'mousemove', {which: 1, clientX: 156, clientY: 65});
  t.equal(preview.css('left'), '150px');
  t.equal(preview.css('top'), '55px');

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
        mouseEndAt: { x: 156, y: 65 },
        mouseStartAt: { x: 6, y: 10 },
        previewElementRect: { x: 150, y: 55, width: 50, height: 50 },
        sourceElementRect: { x: 0, y: 0, width: 50, height: 50 },
        targetElementRect: { x: 100, y: 0, width: 250, height: 250 }
      }
    },
    {
      event: 'hover on tbox_small_inner',
      location: {
        mouseEndAt: { x: 156, y: 65 },
        mouseStartAt: { x: 6, y: 10 },
        previewElementRect: { x: 150, y: 55, width: 50, height: 50 },
        sourceElementRect: { x: 0, y: 0, width: 50, height: 50 },
        targetElementRect: { x: 150, y: 50, width: 100, height: 100 }
      }
    }
  ]);

  clearTrack();

  // drop on tbox_small_inner
  fireEvent(documentElement, 'mouseup', {which: 1, clientX: 156, clientY: 65});

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
        mouseEndAt: { x: 156, y: 65 },
        mouseStartAt: { x: 6, y: 10 },
        previewElementRect: { x: 150, y: 55, width: 50, height: 50 },
        sourceElementRect: { x: 0, y: 0, width: 50, height: 50 },
        targetElementRect: { x: 150, y: 50, width: 100, height: 100 }
      }
    },
    { event: 'dnd:didEnd', isProcessing: undefined, model: undefined }
  ]);

  clearTrack();
  t.end();
});

test('drag type one with no preview, drop on outer target', t => {
  const m = {type: 'one', name: 'model1'};

  fireEvent(box_0_1, 'mousedown', {which: 1, clientX: 5, clientY: 60});
  // first small movement, this is where dnd starts
  fireEvent(documentElement, 'mousemove', {which: 1, clientX: 6, clientY: 60});
  const preview = $('.bcx-dnd-preview');
  t.equal(preview.length, 0);
  // following movement re-position preview.
  fireEvent(documentElement, 'mousemove', {which: 1, clientX: 8, clientY: 60});

  clearTrack();

  // hover over tbox_big move 125px to the right, move 5px down
  fireEvent(documentElement, 'mousemove', {which: 1, clientX: 131, clientY: 65});

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
        mouseEndAt: { x: 131, y: 65 },
        mouseStartAt: { x: 6, y: 60 },
        previewElementRect: { x: 125, y: 55, width: 50, height: 50 },
        sourceElementRect: { x: 0, y: 50, width: 50, height: 50 },
        targetElementRect: { x: 100, y: 0, width: 250, height: 250 }
      }
    }
  ]);

  clearTrack();

  // drop on tbox_big
  fireEvent(documentElement, 'mouseup', {which: 1, clientX: 131, clientY: 65});

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
        mouseEndAt: { x: 131, y: 65 },
        mouseStartAt: { x: 6, y: 60 },
        previewElementRect: { x: 125, y: 55, width: 50, height: 50 },
        sourceElementRect: { x: 0, y: 50, width: 50, height: 50 },
        targetElementRect: { x: 100, y: 0, width: 250, height: 250 }
      }
    },
    { event: 'dnd:didEnd', isProcessing: undefined, model: undefined }
  ]);

  clearTrack();
  t.end();
});

test('drag type two with customised preview, drop on invalid target', t => {
  const m = {type: 'two', name: 'model2'};

  fireEvent(box_0_2, 'mousedown', {which: 1, clientX: 5, clientY: 110});
  // first small movement, this is where dnd starts
  fireEvent(documentElement, 'mousemove', {which: 1, clientX: 6, clientY: 110});
  const preview = $('.bcx-dnd-preview');
  t.equal(preview.length, 1);
  t.equal(preview.css('left'), '0px');
  t.equal(preview.css('top'), '100px');
  t.equal(preview.css('width'), '25px', 'customised width, not source element width.');
  t.equal(preview.css('height'), '20px', 'customised height, not source element height.');


  // following movement re-position preview.
  fireEvent(documentElement, 'mousemove', {which: 1, clientX: 8, clientY: 110});
  t.equal(preview.css('left'), '2px');
  t.equal(preview.css('top'), '100px');

  clearTrack();

  // hover over tbox_big move 125px to the right, move 5px down
  fireEvent(documentElement, 'mousemove', {which: 1, clientX: 131, clientY: 115});

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
  fireEvent(documentElement, 'mouseup', {which: 1, clientX: 131, clientY: 115});

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

test('drag type two with customised preview, hideCursor, centerPreviewToMousePosition, dynamicly add new target, drop on target', t => {
  const m = {type: 'two', name: 'model2'};

  fireEvent(box_0_3, 'mousedown', {which: 1, clientX: 10, clientY: 160});

  t.notOk($('body').hasClass('bcx-dnd-hide-cursor'));
  // first small movement, this is where dnd starts
  fireEvent(documentElement, 'mousemove', {which: 1, clientX: 11, clientY: 160});
  const preview = $('.bcx-dnd-preview');
  t.equal(preview.length, 1);
  t.equal(preview.css('left'), '6px');
  t.equal(preview.css('top'), '155px');
  t.equal(preview.css('width'), '10px', 'customised width, not source element width.');
  t.equal(preview.css('height'), '10px', 'customised height, not source element height.');

  t.ok($('body').hasClass('bcx-dnd-hide-cursor'));

  // following movement re-position preview.
  fireEvent(documentElement, 'mousemove', {which: 1, clientX: 13, clientY: 160});
  t.equal(preview.css('left'), '8px');
  t.equal(preview.css('top'), '155px');

  clearTrack();

  //hover over tbox_big2 move 350px to the right, move 5px down
  fireEvent(documentElement, 'mousemove', {which: 1, clientX: 361, clientY: 165});

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
        mouseEndAt: { x: 361, y: 165 },
        mouseStartAt: { x: 11, y: 160 },
        previewElementRect: { x: 356, y: 160, width: 10, height: 10 },
        sourceElementRect: { x: 0, y: 150, width: 50, height: 50 },
        targetElementRect: { x: 350, y: 0, width: 250, height: 250 }
      }
    }
  ]);

  clearTrack();

  dndService.addTarget(target4);
  // new target has dnd inited.
  t.ok(target4.dnd.isProcessing);
  t.notOk(target4.dnd.isHoveringShallowly);
  t.notOk(target4.dnd.isHovering);
  t.ok(target4.dnd.canDrop);
  t.deepEqual(target4.dnd.model, m);

  //drop on tbox_big2
  fireEvent(documentElement, 'mouseup', {which: 1, clientX: 361, clientY: 165});

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

  t.notOk(target4.dnd.isProcessing);
  t.notOk(target4.dnd.isHoveringShallowly);
  t.notOk(target4.dnd.isHovering);
  t.notOk(target4.dnd.canDrop);
  t.notOk(target4.dnd.model);

  t.deepEqual(_track, [
    { event: 'dnd:willEnd', isProcessing: true, model: { name: 'model2', type: 'two' } },
    {
      event: 'drop on tbox_big2',
      location: {
        mouseEndAt: { x: 361, y: 165 },
        mouseStartAt: { x: 11, y: 160 },
        previewElementRect: { x: 356, y: 160, width: 10, height: 10 },
        sourceElementRect: { x: 0, y: 150, width: 50, height: 50 },
        targetElementRect: { x: 350, y: 0, width: 250, height: 250 }
      }
    },
    { event: 'dnd:didEnd', isProcessing: undefined, model: undefined }
  ]);

  clearTrack();
  t.end();
});

test('drag type two outside of handler has no effect', t => {
  const m = {type: 'two', name: 'model2'};

  fireEvent(box_0_4, 'mousedown', {which: 1, clientX: 20, clientY: 420});

  // first small movement, this is where dnd starts
  fireEvent(documentElement, 'mousemove', {which: 1, clientX: 21, clientY: 420});

  // since out of handler, dnd doesn't start
  const preview = $('.bcx-dnd-preview');
  t.equal(preview.length, 0);
  t.notOk(dndService.isProcessing);
  t.notOk(dndService.model);

  t.end();
});

test('drag type two inside of handler, drop on target', t => {
  const m = {type: 'two', name: 'model2'};

  fireEvent(box_0_4_handler, 'mousedown', {which: 1, clientX: 10, clientY: 240});

  // only mouse down, not yet dnd;
  t.notOk(dndService.isProcessing);
  t.notOk(dndService.model);

  t.deepEqual(_track, []);

  // first small movement, this is where dnd starts
  fireEvent(documentElement, 'mousemove', {which: 1, clientX: 11, clientY: 240});

  // moved mouse, dnd starts
  t.ok(dndService.isProcessing);
  t.deepEqual(dndService.model, m);

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
  t.notOk(target3.dnd.isHoveringShallowly);
  t.notOk(target3.dnd.isHovering);
  t.ok(target3.dnd.canDrop);
  t.deepEqual(target3.dnd.model, m);

  t.ok(target4.dnd.isProcessing);
  t.notOk(target4.dnd.isHoveringShallowly);
  t.notOk(target4.dnd.isHovering);
  t.ok(target4.dnd.canDrop);
  t.deepEqual(target4.dnd.model, m);

  // dndPreview() returns undefined, fall back to default preview.
  const preview = $('.bcx-dnd-preview');
  t.equal(preview.length, 1);
  t.equal(preview.css('left'), '0px'); // initial position of preview
  t.equal(preview.css('top'), '200px');
  t.equal(preview.text(), '04');

  t.deepEqual(_track, [
    { event: 'dnd:willStart', isProcessing: undefined, model: undefined },
    { event: 'dnd:didStart', isProcessing: true, model: { name: 'model2', type: 'two' } }
  ]);

  clearTrack();

  // following movement re-position preview.
  fireEvent(documentElement, 'mousemove', {which: 1, clientX: 13, clientY: 240});
  t.equal(preview.css('left'), '2px'); // moved 2px to the right
  t.equal(preview.css('top'), '200px');

  t.deepEqual(_track, []);

  // move over target3.
  fireEvent(documentElement, 'mousemove', {which: 1, clientX: 361, clientY: 240});
  t.equal(preview.css('left'), '350px'); // moved 350px to the right
  t.equal(preview.css('top'), '200px');

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

  t.ok(target4.dnd.isProcessing);
  t.notOk(target4.dnd.isHoveringShallowly);
  t.notOk(target4.dnd.isHovering);
  t.ok(target4.dnd.canDrop);
  t.deepEqual(target4.dnd.model, m);

  t.deepEqual(_track, [
    {
      event: 'hover on tbox_big2',
      location: {
        mouseEndAt: { x: 361, y: 240 },
        mouseStartAt: { x: 11, y: 240 },
        previewElementRect: { x: 350, y: 200, width: 50, height: 50 },
        sourceElementRect: { x: 0, y: 200, width: 50, height: 50 },
        targetElementRect: { x: 350, y: 0, width: 250, height: 250 }
      }
    },
  ]);

  clearTrack();

  fireEvent(documentElement, 'mouseup', {which: 1, clientX: 361, clientY: 240});

  t.equal($('.bcx-dnd-preview').length, 0);

  t.deepEqual(_track, [
    { event: 'dnd:willEnd', isProcessing: true, model: { name: 'model2', type: 'two' } },
    {
      event: 'drop on tbox_big2',
      location: {
        mouseEndAt: { x: 361, y: 240 },
        mouseStartAt: { x: 11, y: 240 },
        previewElementRect: { x: 350, y: 200, width: 50, height: 50 },
        sourceElementRect: { x: 0, y: 200, width: 50, height: 50 },
        targetElementRect: { x: 350, y: 0, width: 250, height: 250 }
      }
    },
    { event: 'dnd:didEnd', isProcessing: undefined, model: undefined },
  ]);

  clearTrack();

  t.end();
});

test('preview size is correct no matter what box-sizing is in use', t => {

  // box_content_box
  fireEvent(box_content_box, 'mousedown', {which: 1, clientX: 20, clientY: 270});

  // first small movement, this is where dnd starts
  fireEvent(documentElement, 'mousemove', {which: 1, clientX: 21, clientY: 270});

  let preview = $('.bcx-dnd-preview');
  t.equal(preview.length, 1);
  let boundingRect = preview.get(0).getBoundingClientRect();
  t.equal(boundingRect.left, 10);
  t.equal(boundingRect.top, 260);
  t.equal(boundingRect.width, 25 + 5 * 2 + 1 * 2);
  t.equal(boundingRect.height, 25 + 5 * 2 + 1 * 2);

  fireEvent(documentElement, 'mouseup', {which: 1, clientX: 21, clientY: 270});

  // box_border_box
  fireEvent(box_border_box, 'mousedown', {which: 1, clientX: 70, clientY: 270});

  // first small movement, this is where dnd starts
  fireEvent(documentElement, 'mousemove', {which: 1, clientX: 71, clientY: 270});

  preview = $('.bcx-dnd-preview');
  t.equal(preview.length, 1);
  boundingRect = preview.get(0).getBoundingClientRect();
  t.equal(boundingRect.left, 60);
  t.equal(boundingRect.top, 260);
  t.equal(boundingRect.width, 25);
  t.equal(boundingRect.height, 25);

  fireEvent(documentElement, 'mouseup', {which: 1, clientX: 71, clientY: 270});

  t.end();
});

test('cannnot drag a source with false canDrag return', t => {
  // box_0_5
  fireEvent(box_0_5, 'mousedown', {which: 1, clientX: 5, clientY: 10});

  // first small movement, this is where dnd starts
  fireEvent(documentElement, 'mousemove', {which: 1, clientX: 6, clientY: 10});

  t.notOk(dndService.isProcessing);

  fireEvent(documentElement, 'mouseup', {which: 1, clientX: 6, clientY: 10});
  t.end();
});

test('removeSource, removeTarget', t => {
  t.equal(dndService.dndSources.length, 8);
  t.equal(dndService.dndTargets.length, 4);

  dndService.removeSource(box_border_box);
  t.equal(dndService.dndSources.length, 7);
  t.equal(dndService.dndTargets.length, 4);

  dndService.removeSource(box_0_0);
  t.equal(dndService.dndSources.length, 6);
  t.equal(dndService.dndTargets.length, 4);

  dndService.removeTarget(tbox_small_inner);
  t.equal(dndService.dndSources.length, 6);
  t.equal(dndService.dndTargets.length, 3);

  dndService.removeTarget(target1);
  t.equal(dndService.dndSources.length, 6);
  t.equal(dndService.dndTargets.length, 2);
  t.end();
});

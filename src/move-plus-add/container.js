import {inject, computedFrom} from 'aurelia-framework';
import {DndService} from 'bcx-aurelia-dnd';
import {EventAggregator} from 'aurelia-event-aggregator';
import _ from 'lodash';

@inject(DndService, EventAggregator)
export class Container {
  items = [
    {id: '0', dollars: 1, x: 20, y: 20},
    {id: '1', dollars: 1, x: 50, y: 200},
    {id: '2', dollars: 1, x: 200, y: 100}
  ];

  intention;

  constructor(dndService, ea) {
    this.dndService = dndService;
    this.ea = ea;
  }

  attached() {
    this.dndService.addTarget(this);
    this.subscribers = [
      this.ea.subscribe('dnd:willStart', () => this.resetIntention()),
      this.ea.subscribe('dnd:didEnd', () => this.resetIntention())
    ];
  }

  detached() {
    this.dndService.removeTarget(this);
    this.subscribers.forEach(s => s.dispose());
  }

  dndCanDrop(model) {
    return model.type === 'moveItem' ||
           model.type === 'addItem';
  }

  dndDrop(location) {
    const {type, id} = this.dnd.model;
    const {previewElementRect, targetElementRect} = location;
    const newLoc = {
      x: previewElementRect.x - targetElementRect.x,
      y: previewElementRect.y - targetElementRect.y
    };

    if (type === 'moveItem') {
      const idx = _.findIndex(this.items, {id});
      if (idx < 0) return;

      const newItem = {...this.items[idx], ...newLoc};

      // replace old item with new item
      // add new item to the end
      this.items.splice(idx, 1);
      this.items.push(newItem);
    } else if (type === 'addItem') {
      this.items.push({
        id: '' + this.items.length,
        dollars: 1,
        ...newLoc
      });
    }
  }

  dndHover(location) {
    const {type, id} = this.dnd.model;
    const {previewElementRect, targetElementRect} = location;
    const newLoc = {
      x: previewElementRect.x - targetElementRect.x,
      y: previewElementRect.y - targetElementRect.y
    };

    if (type === 'moveItem') {
      const item = _.find(this.items, {id});
      if (!item) return;

      this.intention = {id, x: newLoc.x, y: newLoc.y};
    }
  }

  resetIntention() {
    this.intention = null;
  }

  @computedFrom('items', 'intention')
  get patchedItems() {
    const {items, intention} = this;
    if (!intention) return items;

    let patched = _.reject(items, {id: intention.id});
    const item = _.find(this.items, {id: intention.id});

    if (item) {
      // always show current moving item on top
      patched.push({...item, x: intention.x, y: intention.y});
    }

    return patched;
  }

  @computedFrom('dnd', 'dnd.model', 'dnd.isProcessing', 'dnd.canDrop', 'dnd.isHoveringShallowly')
  get dndCss() {
    if (!this.dnd) return '';
    const {model, isProcessing, canDrop, isHoveringShallowly} = this.dnd;
    if (!isProcessing) return '';
    // no style if moving item
    if (model.type === 'moveItem') return '';
    let css = '';
    if (canDrop) {
      css += 'can-drop';
    } else {
      css += 'can-not-drop';
    }
    if (isHoveringShallowly) css += ' shallow-hover';
    return css;
  }
}

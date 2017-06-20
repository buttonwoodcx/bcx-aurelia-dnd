import {inject, computedFrom} from 'aurelia-framework';
import {DndService} from 'bcx-aurelia-dnd';
import {EventAggregator} from 'aurelia-event-aggregator';
import _ from 'lodash';

@inject(DndService, EventAggregator)
export class Container {
  items = [
    {id: 'a', name: 'A', x: 20, y: 20},
    {id: 'b', name: 'B', x: 50, y: 200},
    {id: 'c', name: 'C', x: 200, y: 100}
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
    return model.type === 'moveItem';
  }

  dndDrop() {
    const {items, intention} = this;
    if (!intention) return;

    const idx = _.findIndex(items, {id: intention.id});

    if (idx >= 0) {
      const item = items[idx];
      items.splice(idx, 1);
      // always show current moving item on top
      items.push({...item, x: intention.x, y: intention.y});
    }
  }

  dndHover(location) {
    const {id} = this.dnd.model;
    const {previewElementRect, targetElementRect} = location;
    const newLoc = {
      x: previewElementRect.x - targetElementRect.x,
      y: previewElementRect.y - targetElementRect.y
    };

    const item = _.find(this.items, {id});
    if (!item) return;

    this.intention = {id, x: newLoc.x, y: newLoc.y};
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
}

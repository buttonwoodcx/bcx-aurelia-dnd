import {inject, computedFrom} from 'aurelia-framework';
import {DndService} from 'bcx-aurelia-dnd';
import {EventAggregator} from 'aurelia-event-aggregator';
import _ from 'lodash';

@inject(DndService, EventAggregator)
export class Container {
  items = [
    {id: 'a', name: 'A', x: 20, y: 20},
    {id: 'b', name: 'B', x: 50, y: 300},
    {id: 'c', name: 'C', x: 300, y: 100}
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

  dndDrop(location) {
    const {id} = this.dnd.model;
    // newLoc has 'x' and 'y'
    const newLoc = location.previewElementOffsetInTargetElement;

    const idx = _.findIndex(this.items, {id});
    if (idx < 0) return;

    const newItem = {...this.items[idx], ...newLoc};

    // replace old item with new item
    this.items.splice(idx, 1, newItem);
  }

  dndHover(location) {
    const {id} = this.dnd.model;
    const newLoc = location.previewElementOffsetInTargetElement;

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

    return _.map(items, item => {
      if (item.id === intention.id) {
        // patch location
        return {...item, x: intention.x, y: intention.y};
      }
      return item;
    });
  }
}

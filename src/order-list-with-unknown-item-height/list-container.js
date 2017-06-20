import {inject, computedFrom} from 'aurelia-framework';
import {DndService} from 'bcx-aurelia-dnd';
import {EventAggregator} from 'aurelia-event-aggregator';
import _ from 'lodash';

@inject(DndService, EventAggregator)
export class ListContainer {
  items = [
    {id: '0', value: 'lorem'},
    {id: '1', value: 'Lorem ipsum dolor sit amet. consectetur adipisicing elit.'},
    {id: '2', value: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Eos, tempore.'},
    {id: '3', value: 'Lorem ipsum dolor sit amet, consectetur.'}
  ];

  intention;

  constructor(dndService, ea) {
    this.dndService = dndService;
    this.ea = ea;
  }

  attached() {
    this.subscribers = [
      this.ea.subscribe('dnd:willStart', () => this.resetIntention()),
      this.ea.subscribe('dnd:didEnd', () => this.fulfillIntention())
    ];
  }

  detached() {
    this.subscribers.forEach(s => s.dispose());
  }

  resetIntention() {
    this.intention = null;
  }

  updateIntention(targetId, beforeTarget) {
    const {isProcessing, model} = this.dndService;
    if (!isProcessing) return;
    if (model.type !== 'orderItemFlex') return;

    const {patchedItems} = this;
    const targetIndex = _.findIndex(patchedItems, {id: targetId});
    if (targetIndex < 0) return;

    let originalIndex;
    let currentIndex;
    let nextIndex;
    if (this.intention) {
      originalIndex = this.intention.fromIndex;
      currentIndex = this.intention.toIndex;
    } else {
      originalIndex = _.findIndex(patchedItems, {id: model.id});
      if (originalIndex < 0) return;
      currentIndex = originalIndex;
    }

    if (currentIndex < targetIndex) {
      // grabbed item is currently above target
      if (beforeTarget) {
        nextIndex = targetIndex - 1;
      } else {
        nextIndex = targetIndex;
      }
    } else /* if (currentIndex > targetIndex) */ { // no need to check, currentIndex never === targetIndex
      // grabbed item is currently below target
      if (beforeTarget) {
        nextIndex = targetIndex;
      } else {
        nextIndex = targetIndex + 1;
      }
    }

    this.intention = {
      fromIndex: originalIndex,
      toIndex: nextIndex
    };
  }

  fulfillIntention() {
    if (!this.intention) return;
    const {fromIndex, toIndex} = this.intention;

    this.resetIntention();
    if (fromIndex === toIndex) return;

    const item = this.items[fromIndex];
    this.items.splice(fromIndex, 1);
    this.items.splice(toIndex, 0, item);
  }

  @computedFrom('items', 'intention')
  get patchedItems() {
    const {items, intention} = this;
    if (!intention) return items;
    const {fromIndex, toIndex} = this.intention;

    let patched = [...items];
    const item = this.items[fromIndex];
    patched.splice(fromIndex, 1);
    patched.splice(toIndex, 0, item);
    return patched;
  }
}

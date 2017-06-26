import {inject, bindable, computedFrom} from 'aurelia-framework';
import {DndService} from 'bcx-aurelia-dnd';
import $ from 'jquery';

@inject(DndService)
export class Item2 {
  @bindable item;
  @bindable updateIntention;

  constructor(dndService) {
    this.dndService = dndService;
  }

  attached() {
    this.dndService.addSource(this, {handler: this.handler});
    this.dndService.addTarget(this);
  }

  detached() {
    this.dndService.removeSource(this);
    this.dndService.removeTarget(this);
  }

  dndModel() {
    return {
      type: 'orderItemFlex2',
      id: this.item.id
    };
  }

  // set canDrop true to receive dndHover, but do nothing in dndDrop
  dndCanDrop(model) {
    return model.type === 'orderItemFlex2' && model.id !== this.item.id;
  }

  // noop
  dndDrop() {
  }

  dndHover(location) {
    const {mouseEndAt, targetElementRect} = location;
    const y = mouseEndAt.y - targetElementRect.y;

    // because of unknown size diff between items,
    // check half size to avoid endless bouncing of swapping two items.
    if (y < (targetElementRect.height / 2)) {
      // hover over top half, user wants to move smth before this item.
      this.updateIntention({targetId: this.item.id, beforeTarget: true});
    } else {
      // hover over bottom half, user wants to move smth after this item.
      this.updateIntention({targetId: this.item.id, beforeTarget: false});
    }
  }

  @computedFrom('item', 'dndService.isProcessing', 'dndService.model')
  get draggingMe() {
    const {item, dndService} = this;
    return dndService.isProcessing &&
           dndService.model.type === 'orderItemFlex2' &&
           dndService.model.id === item.id;
  }
}

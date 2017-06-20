import {inject, bindable, computedFrom} from 'aurelia-framework';
import {DndService} from 'bcx-aurelia-dnd';

@inject(DndService)
export class Item {
  @bindable item;

  constructor(dndService) {
    this.dndService = dndService;
  }

  attached() {
    this.dndService.addSource(this);
  }

  detached() {
    this.dndService.removeSource(this);
  }

  dndModel() {
    return {
      type: 'orderItem',
      item: this.item
    };
  }

  @computedFrom('item', 'dndService.isProcessing', 'dndService.model')
  get draggingMe() {
    const {item, dndService} = this;
    return dndService.isProcessing &&
           dndService.model.type === 'orderItem' &&
           dndService.model.item === item;
  }
}

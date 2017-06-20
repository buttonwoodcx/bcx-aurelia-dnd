import {inject, bindable, computedFrom} from 'aurelia-framework';
import {DndService} from 'bcx-aurelia-dnd';

@inject(DndService)
export class Item2 {
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
      type: 'orderItem2',
      id: this.item.id
    };
  }

  @computedFrom('item', 'dndService.isProcessing', 'dndService.model')
  get draggingMe() {
    const {item, dndService} = this;
    return dndService.isProcessing &&
           dndService.model.type === 'orderItem2' &&
           dndService.model.id === item.id;
  }
}

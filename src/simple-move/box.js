import {inject, bindable, computedFrom} from 'aurelia-framework';
import {DndService} from 'bcx-aurelia-dnd';

@inject(DndService)
export class Box {
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
      type: 'moveItem',
      item: this.item
    };
  }

  @computedFrom('item', 'item.x', 'item.y')
  get positionCss() {
    const x = (this.item && this.item.x) || 0;
    const y = (this.item && this.item.y) || 0;

    return {
      left: x + 'px',
      top: y + 'px'
    };
  }

  @computedFrom('dndService.isProcessing', 'dndService.model')
  get draggingMe() {
    return this.dndService.isProcessing &&
           this.dndService.model.item === this.item;
  }
}

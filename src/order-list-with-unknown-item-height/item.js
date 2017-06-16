import {inject, bindable, computedFrom} from 'aurelia-framework';
import {DndService} from 'bcx-aurelia-dnd';
import $ from 'jquery';

@inject(DndService)
export class Item {
  @bindable item;
  @bindable updateIntention;

  constructor(dndService) {
    this.dndService = dndService;
  }

  attached() {
    this.dndService.addSource(this);
    this.dndService.addTarget(this);
  }

  detached() {
    this.dndService.removeSource(this);
    this.dndService.removeTarget(this);
  }

  dndModel() {
    return {
      type: 'orderItem',
      id: this.item.id
    };
  }

  // use canDrop true to receive dndHover, but do nothing in dndDrop
  dndCanDrop(model) {
    return model.type === 'orderItem' && model.id !== this.item.id;
  }

  // noop
  dndDrop() {}

  dndHover(location) {
    const height = $(this.dndElement).height();
    const {y} = location.mouseEndPointOffsetInTargetElement;

    if (y < (height / 2)) {
      // hover over top half, user want to move smth before this item.
      this.updateIntention({targetId: this.item.id, beforeTarget: true});
    } else {
      // hover over bottom half, user want to move smth after this item.
      this.updateIntention({targetId: this.item.id, beforeTarget: false});
    }
  }

  @computedFrom('item', 'dndService.isProcessing', 'dndService.model')
  get draggingMe() {
    const {item, dndService} = this;
    return dndService.isProcessing &&
           dndService.model.type === 'orderItem' &&
           dndService.model.id === item.id;
  }
}

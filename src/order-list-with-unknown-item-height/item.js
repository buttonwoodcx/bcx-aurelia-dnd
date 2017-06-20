import {inject, bindable, computedFrom} from 'aurelia-framework';
import {DndService} from 'bcx-aurelia-dnd';

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
      type: 'orderItemFlex',
      id: this.item.id
    };
  }

  // set canDrop true to receive dndHover, but do nothing in dndDrop
  dndCanDrop(model) {
    return model.type === 'orderItemFlex' && model.id !== this.item.id;
  }

  // no-op
  dndDrop() {}

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
           dndService.model.type === 'orderItemFlex' &&
           dndService.model.id === item.id;
  }
}

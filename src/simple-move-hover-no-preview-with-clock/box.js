import {inject, bindable, computedFrom} from 'aurelia-framework';
import {DndService} from 'bcx-aurelia-dnd';

@inject(DndService)
export class Box {
  @bindable item;

  constructor(dndService) {
    this.dndService = dndService;
    this.updateClock = this.updateClock.bind(this);
    this.updateClock();
  }

  attached() {
    this.dndService.addSource(this, {noPreview: true});
    this.clockUpdator = setInterval(this.updateClock, 1000);
  }

  detached() {
    this.dndService.removeSource(this);
    if (this.clockUpdator) {
      clearInterval(this.clockUpdator);
      this.clockUpdator = null;
    }
  }

  updateClock() {
    const t = new Date();
    this.clock = t.getHours() + ':' + t.getMinutes() + ':' + t.getSeconds();
  }

  dndModel() {
    return {
      type: 'moveItem',
      id: this.item.id
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
}

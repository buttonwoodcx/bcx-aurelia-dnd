import {inject} from 'aurelia-framework';
import {DndService} from 'bcx-aurelia-dnd';

@inject(DndService)
export class Container {
  items = [
    {name: 'A', x: 20, y: 20},
    {name: 'B', x: 50, y: 200},
    {name: 'C', x: 200, y: 100}
  ];

  constructor(dndService) {
    this.dndService = dndService;
  }

  attached() {
    this.dndService.addTarget(this);
  }

  detached() {
    this.dndService.removeTarget(this);
  }

  dndCanDrop(model) {
    return model.type === 'moveItem';
  }

  dndDrop(location) {
    const {item} = this.dnd.model;
    const {previewElementRect, targetElementRect} = location;
    const newLoc = {
      x: previewElementRect.x - targetElementRect.x,
      y: previewElementRect.y - targetElementRect.y
    };
    item.x = newLoc.x;
    item.y = newLoc.y;

    // move the item to end of array, in order to show it above others
    const idx = this.items.indexOf(item);
    if (idx >= 0) {
      this.items.splice(idx, 1);
      this.items.push(item);
    }
  }
}

import {inject} from 'aurelia-framework';
import {DndService} from 'bcx-aurelia-dnd';

@inject(DndService)
export class Container {
  items = [
    {name: 'A', x: 20, y: 20},
    {name: 'B', x: 50, y: 300},
    {name: 'C', x: 300, y: 100}
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
    const newLoc = location.previewElementOffsetInTargetElement;
    item.x = newLoc.x;
    item.y = newLoc.y;
  }
}

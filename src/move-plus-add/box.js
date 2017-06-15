import {inject, bindable, computedFrom} from 'aurelia-framework';
import {DndService} from 'bcx-aurelia-dnd';

@inject(DndService)
export class Box {
  @bindable item;

  constructor(dndService) {
    this.dndService = dndService;
  }

  attached() {
    this.dndService.addSource(this, {noPreview: true});
    this.dndService.addTarget(this);
  }

  detached() {
    this.dndService.removeSource(this);
    this.dndService.removeTarget(this);
  }

  dndModel() {
    return {
      type: 'moveItem',
      id: this.item.id
    };
  }

  dndCanDrop(model) {
    return model.type === 'addDollar';
  }

  dndDrop() {
    const {type} = this.dnd.model;

    if (type === 'addDollar') {
      this.item.dollars += 1;
    }
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

  @computedFrom('dnd', 'dnd.model', 'dnd.isProcessing', 'dnd.canDrop', 'dnd.isHoveringShallowly')
  get dndCss() {
    if (!this.dnd) return '';
    const {model, isProcessing, canDrop, isHoveringShallowly} = this.dnd;
    if (!isProcessing) return '';
    // no style if moving item
    if (model.type === 'moveItem') return '';
    let css = '';
    if (canDrop) {
      css += 'can-drop';
    } else {
      css += 'can-not-drop';
    }
    if (isHoveringShallowly) css += ' shallow-hover';
    return css;
  }
}

import {inject} from 'aurelia-framework';
import {DndService} from 'bcx-aurelia-dnd';
import {EventAggregator} from 'aurelia-event-aggregator';

@inject(DndService, EventAggregator)
export class CanvasContainer {
  lines = [];
  drawingLine;

  constructor(dndService, ea) {
    this.dndService = dndService;
    this.ea = ea;
  }


  attached() {
    this.dndService.addSource(this, {noPreview: true});
    this.dndService.addTarget(this);
    this.subscribers = [
      this.ea.subscribe('dnd:willStart', () => this.resetDrawingLine()),
      this.ea.subscribe('dnd:didEnd', () => this.resetDrawingLine())
    ];
  }

  detached() {
    this.dndService.removeSource(this);
    this.dndService.removeTarget(this);
    this.subscribers.forEach(s => s.dispose());
  }

  resetDrawingLine() {
    this.drawingLine = null;
  }

  dndModel() {
    return {type: 'drawLine'};
  }

  dndCanDrop(model) {
    return model.type === 'drawLine';
  }

  dndHover(location) {
    const {mouseStartPointPageOffset,
           targetElementPageOffset,
           mouseEndPointOffsetInTargetElement} = location;

    const from = {
      x: mouseStartPointPageOffset.x - targetElementPageOffset.x,
      y: mouseStartPointPageOffset.y - targetElementPageOffset.y
    };

    this.drawingLine = {from, to: mouseEndPointOffsetInTargetElement};
  }

  dndDrop() {
    if (this.drawingLine) {
      this.lines.push(this.drawingLine);
    }
  }
}

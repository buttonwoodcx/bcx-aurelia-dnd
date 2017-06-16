import {inject} from 'aurelia-framework';
import {DndService} from 'bcx-aurelia-dnd';
import {EventAggregator} from 'aurelia-event-aggregator';

@inject(DndService, EventAggregator)
export class CanvasContainer {
  shapes = [];
  drawingShape;

  selectedType = 'drawLine';
  drawingTypes = [
    {value: 'drawLine', label: 'Line'},
    {value: 'drawRect', label: 'Rectangular'}
  ];

  constructor(dndService, ea) {
    this.dndService = dndService;
    this.ea = ea;
  }


  attached() {
    this.dndService.addSource(this, {noPreview: true});
    this.dndService.addTarget(this);
    this.subscribers = [
      this.ea.subscribe('dnd:willStart', () => this.resetDrawingShape()),
      this.ea.subscribe('dnd:didEnd', () => this.resetDrawingShape())
    ];
  }

  detached() {
    this.dndService.removeSource(this);
    this.dndService.removeTarget(this);
    this.subscribers.forEach(s => s.dispose());
  }

  resetDrawingShape() {
    this.drawingShape = null;
  }

  dndModel() {
    return {type: this.selectedType};
  }

  dndCanDrop(model) {
    return model.type === 'drawLine' ||
           model.type === 'drawRect';
  }

  dndHover(location) {
    const {mouseStartPointPageOffset,
           targetElementPageOffset,
           mouseEndPointOffsetInTargetElement} = location;

    const start = {
      x: mouseStartPointPageOffset.x - targetElementPageOffset.x,
      y: mouseStartPointPageOffset.y - targetElementPageOffset.y
    };

    const end = mouseEndPointOffsetInTargetElement;

    if (this.dnd.model.type === 'drawLine') {
      this.drawingShape = {type: 'line', from: start, to: end};
    } else if (this.dnd.model.type === 'drawRect') {
      const x = Math.min(start.x, end.x);
      const y = Math.min(start.y, end.y);
      const width = Math.abs(start.x - end.x);
      const height = Math.abs(start.y - end.y);
      this.drawingShape = {type: 'rect', x, y, width, height};
    }
  }

  dndDrop() {
    if (this.drawingShape) {
      this.shapes.push(this.drawingShape);
    }
  }
}

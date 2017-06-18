import {inject} from 'aurelia-framework';
import {BoundViewFactory, ViewSlot, templateController} from 'aurelia-templating';
import {If} from 'aurelia-templating-resources';

@templateController
@inject(BoundViewFactory, ViewSlot)
export class IfNotCustomAttribute extends If {
  constructor(viewFactory, viewSlot) {
    super(viewFactory, viewSlot);
  }

  valueChanged(newValue) {
    super.valueChanged(!newValue);
  }
}

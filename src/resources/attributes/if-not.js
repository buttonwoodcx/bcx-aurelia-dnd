import {templateController} from 'aurelia-templating';
import {If} from 'aurelia-templating-resources';

@templateController
export class IfNotCustomAttribute extends If {
  valueChanged(newValue) {
    super.valueChanged(!newValue);
  }
}

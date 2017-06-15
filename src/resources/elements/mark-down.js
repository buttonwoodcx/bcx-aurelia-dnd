import {bindable} from 'aurelia-framework';
import showdown from 'showdown';

export class MarkDown {
  @bindable value;

  constructor() {
    this.converter = new showdown.Converter();
  }

  valueChanged(newValue, oldValue) {
    this.html = this.converter.makeHtml(newValue);
  }
}


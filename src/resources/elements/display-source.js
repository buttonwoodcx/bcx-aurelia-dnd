import {bindable} from 'aurelia-framework';

export class DisplaySource {
  @bindable filename;
  fileContent;

  bind() {
    this.reloadContent();
  }

  filenameChanged() {
    this.reloadContent();
  }

  reloadContent() {
    this.fileContent = null;
    require([`text!../${this.filename}`], content => this.fileContent = content);
  }

}

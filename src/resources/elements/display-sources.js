import {bindable} from 'aurelia-framework';

export class DisplaySources {
  @bindable filenames;
  selected;
  fullScreen = false;

  bind() {
    if (this.filenames && this.filenames.length) {
      this.selected = this.filenames[0];
    }
  }
}

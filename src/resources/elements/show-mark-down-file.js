import {bindable} from 'aurelia-framework';

export class ShowMarkDownFile {
  @bindable filename;
  markdown = '';

  bind() {
    this.reloadContent(this.filename);
  }

  filenameChanged(newFilename) {
    this.reloadContent(newFilename);
  }

  reloadContent(filename) {
    this.markdown = '';
    require([`text!${filename}`], content => this.markdown = content);
  }
}

/* global require */
import {bindable} from 'aurelia-framework';

export class DisplaySource {
  @bindable filename;
  fileContent;
  loading = false;

  bind() {
    this.reloadContent();
  }

  filenameChanged() {
    this.reloadContent();
  }

  reloadContent() {
    this.fileContent = null;
    this.loading = true;

    require([`text!../${this.filename}`],
      content => {
        this.fileContent = content;
        this.loading = false;
      },
      err => {
        this.fileContent = 'Failed to load ' + this.filename;
        this.loading = false;
      }
    );
  }
}

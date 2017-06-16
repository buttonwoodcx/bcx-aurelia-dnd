import {inject} from 'aurelia-framework';
import {DndService} from 'bcx-aurelia-dnd';
import $ from 'jquery';

@inject(DndService)
export class AddMoney {

  constructor(dndService) {
    this.dndService = dndService;
  }

  attached() {
    this.dndService.addSource(this, {centerPreviewToMousePosition: true, hideCursor: true});
  }

  detached() {
    this.dndService.removeSource(this);
  }

  dndModel() {
    return {
      type: 'addDollar'
    };
  }

  dndPreview() {
    const jq = $(`
      <div class="dollar"></div>
    `);

    return jq.get(0);
  }

}

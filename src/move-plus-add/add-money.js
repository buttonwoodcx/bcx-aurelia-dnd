import {inject} from 'aurelia-framework';
import {DndService} from 'bcx-aurelia-dnd';
import $ from 'jquery';

@inject(DndService)
export class AddMoney {

  constructor(dndService) {
    this.dndService = dndService;
  }

  attached() {
    this.dndService.addSource(this);
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
      <div class="example-box">A dollar!</div>
    `);
    jq.css('width', 'auto');
    jq.css('height', 'auto');

    return jq.get(0);
  }

}

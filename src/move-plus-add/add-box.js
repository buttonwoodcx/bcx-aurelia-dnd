import {inject} from 'aurelia-framework';
import {DndService} from 'bcx-aurelia-dnd';
import $ from 'jquery';

@inject(DndService)
export class AddBox {
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
      type: 'addItem'
    };
  }

  dndPreview() {
    const jq = $(`
      <div class="example-box">new box</div>
    `);
    // style the dom if needed
    // jq.css('width', '80px');
    // jq.css('height', '40px');

    return jq.get(0);
  }
}

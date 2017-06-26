import {inject, bindable, computedFrom} from 'aurelia-framework';
import {DndService} from 'bcx-aurelia-dnd';
import $ from 'jquery';

@inject(DndService)
export class Item {
  @bindable item;

  constructor(dndService) {
    this.dndService = dndService;
  }

  attached() {
    this.dndService.addSource(this, {handler: this.handler});
  }

  detached() {
    this.dndService.removeSource(this);
  }

  dndModel() {
    return {
      type: 'orderItem',
      item: this.item
    };
  }

  dndPreview(model) {
    // can access the item on model.item or this.item

    // when building html by string, to be safe, better to
    // use jquery $('<td><td>').text(this.item.name).
    // Not demonstrated here.
    const jq = $(`
      <table class="table-container">
        <tr>
          <td style="width:30px;">
            <div class="handler"></div>
          </td>
          <td>${this.item.name}</td>
          <td>${this.item.age}</td>
        </tr>
      </table>
    `);

    // table.table-container has width: 100%;
    // we need to fix the width of preview

    // get calculated width of source element
    const width = $(this.dndElement).css('width');
    // fix preview width
    jq.css('width', width);

    // if you want to make every columns perfect.
    // here is for name column
    const width2 = $(this.dndElement).find('td:nth-child(2)').css('width');
    jq.find('td:nth-child(2)').css('width', width2);

    return jq.get(0);
  }

  @computedFrom('item', 'dndService.isProcessing', 'dndService.model')
  get draggingMe() {
    const {item, dndService} = this;
    return dndService.isProcessing &&
           dndService.model.type === 'orderItem' &&
           dndService.model.item === item;
  }
}

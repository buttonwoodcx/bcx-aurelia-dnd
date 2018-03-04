import $ from 'jquery';

export class TableContainer {
  items = [
    {name: 'Bob', age: 23},
    {name: 'Ali', age: 37},
    {name: 'Tom', age: 12},
    {name: 'Emma', age: 18}
  ];

  rowPreview(item) {
    // when building html by string, to be safe, better to
    // use jquery $('<td><td>').text(item.name).
    // Not demonstrated here.
    const jq = $(`
      <table class="table-container">
        <tr>
          <td style="width:30px;">
            <div class="handler"></div>
          </td>
          <td>${item.name}</td>
          <td>${item.age}</td>
        </tr>
      </table>
    `);

    // table.table-container has width: 100%;
    // we need to fix the width of preview

    // get calculated width of source element
    const width = $(this.tableBody).css('width');
    // fix preview width
    jq.css('width', width);

    // if you want to make every columns perfect.
    // here is for name column
    const width2 = $(this.tableBody).find('td:nth-child(2)').css('width');
    jq.find('td:nth-child(2)').css('width', width2);

    return jq.get(0);
  }

}

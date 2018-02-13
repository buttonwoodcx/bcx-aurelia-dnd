import $ from 'jquery';

export class TableContainer {
  items = [
    {name: 'Bob', age: 23},
    {name: 'Ali', age: 37},
    {name: 'Tom', age: 12},
    {name: 'Emma', age: 18}
  ];

  afterReordering(items) {
    // use either `items` or `this.items` for updated array model
    console.log('Items has been updated to: ' + JSON.stringify(items));
  }
}

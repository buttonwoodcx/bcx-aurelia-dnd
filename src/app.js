export class App {
  configureRouter(config, router) {
    this.router = router;

    config.title = 'bcx-aurelia-dnd examples';
    // config.options.pushState = true;
    config.map([
      {
        route: '', name: 'simple',
        title: 'Move object',
        nav: true,
        moduleId: 'simple-move/index'
      },
      {
        route: 'simple-move-hover-no-preview', name: 'simple-move-hover-no-preview',
        title: 'Move object, no preview, use dndHover',
        nav: true,
        moduleId: 'simple-move-hover-no-preview/index'
      },
      {
        route: 'move-plus-add', name: 'move-plus-add',
        title: 'Move object, add object, customize preview',
        nav: true,
        moduleId: 'move-plus-add/index'
      },
      {
        route: 'draw', name: 'draw',
        title: 'Draw in canvas',
        nav: true,
        moduleId: 'draw/index'
      }
    ]);
  }

}

export class App {
  configureRouter(config, router) {
    this.router = router;

    config.title = 'bcx-aurelia-dnd examples';
    // config.options.pushState = true;
    config.map([
      {
        route: 'overview', name: 'overview',
        title: 'Overview',
        nav: true,
        settings: {
          section: 'tutorial',
          trunks: [
            'tutorial/overview.md'
          ]
        },
        moduleId: 'show-tutorial'
      },
      {
        route: 'source-and-target', name: 'source-and-target',
        title: 'Source and Target',
        nav: true,
        settings: {
          section: 'tutorial',
          trunks: [
            'tutorial/source-and-target.md',
            // 'simple-move-step-1/index'
          ]
        },
        moduleId: 'show-tutorial'
      },
      {
        route: 'testing', name: 'testing',
        title: 'Testing',
        nav: true,
        settings: {
          section: 'tutorial',
          trunks: [
            'tutorial/testing.md'
          ]
        },
        moduleId: 'show-tutorial'
      },
      {
        route: 'simple', name: 'simple',
        title: 'Move object',
        nav: true,
        settings: {section: 'examples'},
        moduleId: 'simple-move/index'
      },
      {
        route: 'simple-move-hover-no-preview', name: 'simple-move-hover-no-preview',
        title: 'Move object, no preview, use dndHover',
        nav: true,
        settings: {section: 'examples'},
        moduleId: 'simple-move-hover-no-preview/index'
      },
      {
        route: 'move-plus-add', name: 'move-plus-add',
        title: 'Move object, add object, customize preview',
        nav: true,
        settings: {section: 'examples'},
        moduleId: 'move-plus-add/index'
      },
      {
        route: 'draw', name: 'draw',
        title: 'Draw object',
        nav: true,
        settings: {section: 'examples'},
        moduleId: 'draw/index'
      },
      {
        route: 'order-simple', name: 'order-simple',
        title: 'Re-order list with fixed item height',
        nav: true,
        settings: {section: 'examples'},
        moduleId: 'order-list-with-fixed-item-height/index'
      },
      {
        route: 'order-flex', name: 'order-flex',
        title: 'Re-order list with unknown item height',
        nav: true,
        settings: {section: 'examples'},
        moduleId: 'order-list-with-unknown-item-height/index'
      },
      {
        route: '',
        redirect: 'overview'
      }
    ]);
  }

}

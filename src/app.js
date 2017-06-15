export class App {
  configureRouter(config, router) {
    this.router = router;

    config.title = 'bcx-aurelia-dnd examples';
    // config.options.pushState = true;
    config.map([
      {
        route: 'tutorial/overview.md', name: 'overview',
        title: 'Overview',
        nav: true,
        settings: {section: 'tutorial'},
        moduleId: 'show-tutorial'
      },
      {
        route: 'tutorial/source-and-target.md', name: 'source-and-target',
        title: 'Source and Target',
        nav: true,
        settings: {section: 'tutorial'},
        moduleId: 'show-tutorial'
      },
      {
        route: 'tutorial/testing.md', name: 'testing',
        title: 'Testing',
        nav: true,
        settings: {section: 'tutorial'},
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
        route: '',
        redirect: 'tutorial/overview.md'
      }
    ]);
  }

}

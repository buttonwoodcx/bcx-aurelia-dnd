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
            'tutorial/source-and-target-part1.md',
            'simple-move-step-1/index',
            'tutorial/source-and-target-part2.md',
            'simple-move-step-2/index',
            'tutorial/source-and-target-part3.md',
            'simple-move/inline',
            'tutorial/source-and-target-part4.md'
          ]
        },
        moduleId: 'show-tutorial'
      },
      {
        route: 'customize-preview-and-hover', name: 'customize-preview-and-hover',
        title: 'Customize preview and respond to dndHover',
        nav: true,
        settings: {
          section: 'tutorial',
          trunks: [
            'tutorial/customize-preview-and-hover-part1.md',
            'simple-move-hover-no-preview-with-clock/index',
            'tutorial/customize-preview-and-hover-part2.md',
            'move-plus-add/inline',
            'tutorial/customize-preview-and-hover-part3.md',
            'order-table/inline',
            'tutorial/customize-preview-and-hover-part4.md'
          ]
        },
        moduleId: 'show-tutorial'
      },
      {
        route: 're-order-list', name: 're-order-list',
        title: 'Re-order a list',
        nav: true,
        settings: {
          section: 'tutorial',
          trunks: [
            'tutorial/re-order-list-part1.md',
            'order-list-with-fixed-item-height/inline',
            'tutorial/re-order-list-part2.md',
            'order-list-with-unknown-item-height/inline',
            'tutorial/re-order-list-part3.md'
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
        route: 'dnd-service-reference', name: 'dnd-service-reference',
        title: 'DndService',
        nav: true,
        settings: {
          section: 'reference',
          trunks: [
            'tutorial/dnd-service-reference.md'
          ]
        },
        moduleId: 'show-tutorial'
      },
      {
        route: 'simple', name: 'simple',
        title: '1. Move object',
        nav: true,
        settings: {section: 'examples'},
        moduleId: 'simple-move/index'
      },
      {
        route: 'simple-move-hover-no-preview', name: 'simple-move-hover-no-preview',
        title: '2. Move object, no preview, use dndHover',
        nav: true,
        settings: {section: 'examples'},
        moduleId: 'simple-move-hover-no-preview/index'
      },
      {
        route: 'move-plus-add', name: 'move-plus-add',
        title: '3. Move object, add object, customize preview',
        nav: true,
        settings: {section: 'examples'},
        moduleId: 'move-plus-add/index'
      },
      {
        route: 'draw', name: 'draw',
        title: '4. Draw object',
        nav: true,
        settings: {section: 'examples'},
        moduleId: 'draw/index'
      },
      {
        route: 'order-simple', name: 'order-simple',
        title: '5. Re-order list with fixed item height',
        nav: true,
        settings: {section: 'examples'},
        moduleId: 'order-list-with-fixed-item-height/index'
      },
      {
        route: 'order-flex', name: 'order-flex',
        title: '6. Re-order list with unknown item height',
        nav: true,
        settings: {section: 'examples'},
        moduleId: 'order-list-with-unknown-item-height/index'
      },
      {
        route: 'order-table', name: 'order-table',
        title: '7. Customize preview for <tr>',
        nav: true,
        settings: {section: 'examples'},
        moduleId: 'order-table/index'
      },
      {
        route: '',
        redirect: 'overview'
      }
    ]);
  }

}

export class App {
  configureRouter(config, router) {
    this.router = router;

    config.title = 'bcx-aurelia-dnd examples';
    // config.options.pushState = true;
    config.mapUnknownRoutes((instruction) => {
      console.log('mapUnknownRoutes', instruction);
      return 'not-found';
    });
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
            'tutorial/customize-preview-and-hover-part4.md',
            'order-table-with-handler/inline',
            'tutorial/customize-preview-and-hover-part5.md'
          ]
        },
        moduleId: 'show-tutorial'
      },
      {
        route: 're-order-list', name: 're-order-list',
        title: '(deprecated) Re-order a list',
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
            'tutorial/testing-part1.md',
            'tutorial/test-example',
            'tutorial/testing-part2.md'
          ]
        },
        moduleId: 'show-tutorial'
      },
      {
        route: 'bcx-aurelia-reorderable-repeat', name: 'bcx-aurelia-reorderable-repeat',
        title: 'reorderable-repeat',
        nav: true,
        settings: {
          section: 'tutorial',
          trunks: [
            'tutorial/bcx-aurelia-reorderable-repeat-part1.md',
            'order-list-with-fixed-item-height-reorderable-repeat/inline',
            'tutorial/bcx-aurelia-reorderable-repeat-part2.md',
            'order-list-with-fixed-item-height-reorderable-repeat-step2/inline',
            'tutorial/bcx-aurelia-reorderable-repeat-part3.md',
            'order-list-with-unknown-item-height-reorderable-repeat/inline',
            'tutorial/bcx-aurelia-reorderable-repeat-part4.md',
            'order-table-with-handler-reorderable-repeat/inline',
            'tutorial/bcx-aurelia-reorderable-repeat-part5.md',
            'order-table-with-handler-reorderable-repeat-step2/inline',
            'tutorial/bcx-aurelia-reorderable-repeat-part6.md',
            'reorderable-direction/inline',
            'tutorial/bcx-aurelia-reorderable-repeat-part7.md',
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
        title: '5. (deprecated) Re-order list with fixed item height',
        nav: true,
        settings: {section: 'examples'},
        moduleId: 'order-list-with-fixed-item-height/index'
      },
      {
        route: 'order-flex', name: 'order-flex',
        title: '6. (deprecated) Re-order list with unknown item height',
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
        route: 'order-table-with-handler', name: 'order-table-with-handler',
        title: '8. Customize preview for <tr> with handler',
        nav: true,
        settings: {section: 'examples'},
        moduleId: 'order-table-with-handler/index'
      },
      {
        route: 'order-simple-reorderable-repeat-step2', name: 'order-simple-reorderable-repeat-step2',
        title: '1. Re-order list with fixed item height',
        nav: true,
        settings: {section: 'reorderable-repeat-examples'},
        moduleId: 'order-list-with-fixed-item-height-reorderable-repeat-step2/index'
      },
      {
        route: 'order-flex-reorderable-repeat-step2', name: 'order-flex-reorderable-repeat-step2',
        title: '2. Re-order list with unknown item height',
        nav: true,
        settings: {section: 'reorderable-repeat-examples'},
        moduleId: 'order-list-with-unknown-item-height-reorderable-repeat/index'
      },
      {
        route: 'order-table-with-handler-reorderable-repeat', name: 'order-table-with-handler-reorderable-repeat',
        title: '3. Customize preview for <tr> with handler',
        nav: true,
        settings: {section: 'reorderable-repeat-examples'},
        moduleId: 'order-table-with-handler-reorderable-repeat-step2/index'
      },
      {
        route: 'reorderable-direction', name: 'reorderable-direction',
        title: '4. DOM flow direction',
        nav: true,
        settings: {section: 'reorderable-repeat-examples'},
        moduleId: 'reorderable-direction/index'
      },
      {
        route: '',
        redirect: 'overview'
      }
    ]);
  }
}

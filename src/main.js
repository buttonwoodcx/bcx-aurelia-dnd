import environment from './environment';

export function configure(aurelia) {
  aurelia.use
    .standardConfiguration()
    .feature('resources');

  aurelia.use.plugin('bcx-aurelia-reorderable-repeat');
  // if (environment.debug) {
  //   aurelia.use.developmentLogging();
  // }

  if (environment.testing) {
    aurelia.use.plugin('aurelia-testing');
  }

  aurelia.start().then(() => aurelia.setRoot());
}

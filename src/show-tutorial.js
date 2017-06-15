import {activationStrategy} from 'aurelia-router';

export class ShowTutorial {
  activate(params, routeConfig) {
    this.filename = routeConfig.route;
  }

  determineActivationStrategy() {
    return activationStrategy.replace;
  }
}

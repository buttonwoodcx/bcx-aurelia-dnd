import {activationStrategy} from 'aurelia-router';

export class ShowTutorial {
  activate(params, routeConfig) {
    this.trunks = routeConfig.settings.trunks;
  }

  determineActivationStrategy() {
    return activationStrategy.replace;
  }
}

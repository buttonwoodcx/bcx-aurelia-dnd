import _ from 'lodash';

export class NavSectionValueConverter {
  toView(navs, section) {
    return _.filter(navs, n => _.get(n, 'settings.section') === section);
  }

}


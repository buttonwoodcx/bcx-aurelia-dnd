import _ from 'lodash';

export class EndsWithValueConverter {
  toView(str, subfix) {
    return _.endsWith(str, subfix);
  }
}


import _ from 'lodash';

class Helpers {
  static valueToString(value) {
    if (typeof value === 'string' || value instanceof String) {
      return value;
    }
    if (typeof value === 'number') {
      return `${value}`;
    }

    return '';
  }

  static valueToJson(value) {
    return JSON.stringify({ v: value });
  }

  static jsonToValue(json) {
    const { v } = JSON.parse(json);
    return v;
  }

  static getValuesDiff(prev, current) {
    return _.transform(current, (result, value, key) => {
      if (_.isUndefined(prev[key])) {
        // eslint-disable-next-line no-param-reassign
        result[key] = value;
      } else if (!_.isEqual(value, prev[key])) {
        // eslint-disable-next-line no-param-reassign
        result[key] = _.isObject(value) || _.isArray(value) ? Helpers.getValuesDifference(value, prev[key]) : value;
      }
    });
  }
}

export default Helpers;

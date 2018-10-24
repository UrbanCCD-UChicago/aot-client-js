
export class F {

  constructor (...args) {
    this.filters = {};

    if (arguments.length) {
      let key, params;
      [key, ...params] = args;
      this.filters[key] = new Array(params);
    }
  }

  and(other) {
    if (other.constructor != F) { throw new Error('Cannot .and non-F types'); }

    let otherKeys = Object.keys(other.filters);
    for (var k in otherKeys) {
      let key = otherKeys[k];
      let value = other.filters[key];
      
      if (this.filters.hasOwnProperty(key)) {
        for (var i = 0; i < value.length; i++) { this.filters[key].push(value[i]); }
      } else {
        this.filters[key] = value;
      }
    }

    return this;
  }

  or(other) {
    if (other.constructor != F) { throw new Error('Cannot .or non-F types'); }

    for (var key in other.filters) {
      this.filters[key] = other.filters[key];
    }

    return this;
  }

  toQueryParams() {
    let params = [];

    let keys = Object.keys(this.filters);
    for (var k in keys) {
      let key = keys[k];
      let value = this.filters[key];

      if (value.length > 1) {
        key = `${key}[]`;
      }

      for (var j in value) {
        let vals = value[j];
        let joined = vals.join(':');
        params.push([key, joined]);
      }
    }

    return params;
  }
}
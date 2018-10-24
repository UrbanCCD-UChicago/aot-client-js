/**
 * F is funky little class that allows you to _compose_ query parameters.
 * 
 * For detailed information about the API, it's endpoints, responses and
 * available parameters visit
 * {@link https://arrayofthings.docs.apiary.io/# https://arrayofthings.docs.apiary.io/#}.
 *
 * @example
 * // using an F object exposes some powerful API workflows
 * let f = new F('by_sensor', 'metsense.bmp180.temperature');
 * f = f.and(new F('timestamp', 'ge', '2018-08-01T00:00:00'));
 * f = f.and(new F('timestamp', 'lt', '2018-09-01T00:00:00'));
 * f = f.and(new F('value', 'avg', 'node_vsn'));
 * let avgTempAugNodes = await client.listObservations({filters: f});
 */
export class F {

  /**
   * Create a new F
   * 
   * @param  {...any} args - Any arbitrary amount of arguments to build a query param
   * 
   * @example
   * let f = new F('value', 'lt', 42)
   * 
   * @example
   * let f = new F('page', '2')
   * 
   * @example
   * let f = new F('as_histograms', 20, 30, 2000, 3000, 5, 'node_vsn')
   */
  constructor (...args) {
    this.filters = {};

    if (arguments.length) {
      let key, params;
      [key, ...params] = args;
      this.filters[key] = new Array(params);
    }
  }

  /**
   * Performs a logical _AND_ between two F objects. If the keys of the other F object
   * are not present in this object, those keys are simply added; if a key is present then
   * its values are concatenated to this object's values.
   * 
   * @param {F} other - The other F object you're joining to this one
   * @returns A concatenated F object
   * @see F.or
   * 
   * @example
   * let f = new F('value', 'gt', 0);
   * f = f.and(new F('value', 'le', 10))
   * f.filters
   * // { value: [ ['gt', 0], ['le', 10] ]}
   */
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

  /**
   * Performs a logical _OR_ between two F objects. If the keys of the other F object
   * are not present in this object, those keys are simply added. if a key is present then
   * its values are overwritten with the values of the other object.
   * 
   * @param {F} other - The other F object you're updating this one with
   * @returns An updated F object
   * @see F.and
   * 
   * @example
   * let f = new F('value', 'gt', 0);
   * f = f.or(new F('value', 'le', 10))
   * f.filters
   * // { value: [ ['le', 10] ]}
   */
  or(other) {
    if (other.constructor != F) { throw new Error('Cannot .or non-F types'); }

    for (var key in other.filters) {
      this.filters[key] = other.filters[key];
    }

    return this;
  }

  /**
   * Assembles the key/value pairs to an array of arrays that can be used to 
   * build query params. **Note:** you probably don't ever need to call this as
   * it's used in the client to format F objects passed to its methods.
   * 
   * @returns The values formatted so that they can be used to build query params
   */
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
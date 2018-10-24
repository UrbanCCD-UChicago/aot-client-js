/**
 * The client used to get data from the Array of Things API.
 * 
 * All methods of this class return an object (the response body). The
 * response data is accessible with the `data` key. For _get_ methods
 * the data is a single object; for _list_ methods the data is an array
 * of objects.
 * 
 * For _list_ methods there is an additional `meta` object with details
 * about the request query and links.
 * 
 * For detailed information about the API, it's endpoints, responses and
 * available parameters visit 
 * {@link https://arrayofthings.docs.apiary.io/# https://arrayofthings.docs.apiary.io/#}.
 * 
 * @example
 * let client = new AotClient();
 * let observations = [];
 * let res = await client.listObservations();
 * observations.concat(res.data);
 * let next = client.getNextPage(res);
 * while (next !== null) {
 *   observations.concat(next.data);
 *   next = client.getNextPage(next);
 * }
 */
export class AotClient {
  
  /**
   * Create a new client
   * 
   * @param {String} [hostname=https://api.arrayofthings.org/api] - The full hostname and path to the base of the API
   */
  constructor({hostname = 'https://api.arrayofthings.org/api'} = {}) {
    this.hostname = hostname;
  }

  /**
   * Gets an array of project metadata records
   * 
   * @async
   * @param {F} [filters=null] - An `F` object to apply filters/query params to the request
   * @returns The projects' information -- {@link https://arrayofthings.docs.apiary.io/#reference/0/project-endpoint Projects Endpoint Docs}.
   * @see F
   * 
   * @example
   * // projects can be returned as geojson for easier mapping inputs
   * let hulls = await client.listProjects({filters: new F('format', 'geojson')})
   */
  async listProjects({ filters = null } = {}) {
    let endpoint = `${this.hostname}/projects`;
    return this._sendRequest(endpoint, filters);
  }

  /**
   * Gets the metadata record for a specific project
   * 
   * @async
   * @param {String} slug - The project's slug 
   * @param {F} [filters=numm] - An `F` object to apply filters/query params to the request
   * @returns The project's information -- {@link https://arrayofthings.docs.apiary.io/#reference/0/project-endpoint Projects Endpoint Docs}
   * @see F
   */
  async getProjectDetails(slug, { filters = null } = {}) {
    let endpoint = `${this.hostname}/projects/${slug}`;
    return this._sendRequest(endpoint, filters);
  }

  /**
   * Gets an array of node metadata records
   * 
   * @async
   * @param {F} [Filers=null] - An `F` object to apply filters/query params to the request
   * @returns The nodes' information -- {@link https://arrayofthings.docs.apiary.io/#reference/0/node-endpoint Nodes Endpoint Docs}
   * @see F
   *
   * @example
   * // nodes can be returned as geojson for easier mapping inputs
   * let points = await client.listNodes({filters: new F('format', 'geojson')})
   */
  async listNodes({ filters = null } = {}) {
    let endpoint = `${this.hostname}/nodes`;
    return this._sendRequest(endpoint, filters);
  }

  /**
   * Gets the metadata record for a specific node
   * 
   * @async
   * @param {String} vsn - The node's identifier
   * @param {F} [filters=null] - An `F` object to apply filters/query params to the request
   * @returns The node's information -- {@link https://arrayofthings.docs.apiary.io/#reference/0/node-endpoint Nodes Endpoint Docs}
   * @see F
   */
  async getNodeDetails(vsn, { filters = null } = {}) {
    let endpoint = `${this.hostname}/nodes/${vsn}`;
    return this._sendRequest(endpoint, filters);
  }

  /**
   * Gets an array of sensor metadta records
   * 
   * @async
   * @param {F} [Filers=null] - An `F` object to apply filters/query params to the request
   * @returns The sensors' information -- {@link https://arrayofthings.docs.apiary.io/#reference/0/sensor-endpoint Sensors Endpoint Docs}
   * @see F
   */
  async listSensors({ filters = null } = {}) {
    let endpoint = `${this.hostname}/sensors`;
    return this._sendRequest(endpoint, filters);
  }

  /**
   * Gets the metadata record for a specific sensor
   * 
   * @async
   * @param {String} path - The sensor's identifier
   * @param {F} [Filers=null] - An `F` object to apply filters/query params to the request
   * @returns The sensor's information -- {@link https://arrayofthings.docs.apiary.io/#reference/0/sensor-endpoint Sensors Endpoint Docs}
   * @see F
   */
  async getSensorDetails(path, { filters = null } = {}) {
    let endpoint = `${this.hostname}/sensors/${path}`;
    return this._sendRequest(endpoint, filters);
  }

  /**
   * Gets an array of observation records
   * 
   * @async
   * @param {F} [Filers=null] - An `F` object to apply filters/query params to the request
   * @returns The observation records -- {@link https://arrayofthings.docs.apiary.io/#reference/0/observations-endpoint Observations Endpoint Docs}
   * @see F
   * 
   * @example
   * // using an F object exposes some powerful API workflows
   * let f = new F('by_sensor', 'metsense.bmp180.temperature');
   * f = f.and(new F('timestamp', 'ge', '2018-08-01T00:00:00'));
   * f = f.and(new F('timestamp', 'lt', '2018-09-01T00:00:00'));
   * f = f.and(new F('value', 'avg', 'node_vsn'));
   * let avgTempAugNodes = await client.listObservations({filters: f});
   */
  async listObservations({ filters = null } = {}) {
    let endpoint = `${this.hostname}/observations`;
    return this._sendRequest(endpoint, filters);
  }

  /**
   * Gets an array of raw observation records
   * 
   * @async
   * @param {F} [Filers=null] - An `F` object to apply filters/query params to the request
   * @returns The raw observation records -- {@link https://arrayofthings.docs.apiary.io/#reference/0/raw-observations Raw Observations Endpoint Docs}
   * @see F
   *
   * @example
   * // using an F object exposes some powerful API workflows
   * let f = new F('by_sensor', 'metsense.bmp180.temperature');
   * f = f.and(new F('timestamp', 'ge', '2018-08-01T00:00:00'));
   * f = f.and(new F('timestamp', 'lt', '2018-09-01T00:00:00'));
   * f = f.and(new F('value', 'avg', 'node_vsn'));
   * let avgTempAugNodes = await client.listRawObservations({filters: f});
   */
  async listRawObservations({ filters = null } = {}) {
    let endpoint = `${this.hostname}/raw-observations`;
    return this._sendRequest(endpoint, filters);
  }

  /**
   * Gets the next page of results as dictated by the current page's `meta.links.next` value
   * 
   * @async
   * @param {Object} resp -- The returned response from any of the list methods, including the response to this method
   * @returns The next page of records
   */
  async getNextPage(resp) {
    if (resp.hasOwnProperty('meta')) {
      let nextUrl = resp.meta.links.next;
      return this._sendRequest(nextUrl, null);
    } else {
      return null;
    }
  }

  async _sendRequest(endpoint, filters) {
    let url = new URL(endpoint);

    if (filters !== null) { 
      url.search = new URLSearchParams(filters.toQueryParams()); 
    }
    
    return fetch(url)
      .then(response => {
        if (!response.ok) {
          throw new Error('response was not ok -- we can handle this later');
        } else {
          return response.json();
        }
      })
      .then(data => {
        return data;
      })
      .catch(error => {
        throw error;
      });
  }
}
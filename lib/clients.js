
export class AotClient {
  
  constructor({hostname = 'https://api.arrayofthings.org/api'} = {}) {
    this.hostname = hostname;
  }

  async listProjects({ filters = null } = {}) {
    let endpoint = '/projects';
    return this._sendRequest(endpoint, filters);
  }

  async getProjectDetails(slug, { filters = null } = {}) {
    let endpoint = `/projects/${slug}`;
    return this._sendRequest(endpoint, filters);
  }

  async listNodes({ filters = null } = {}) {
    let endpoint = '/nodes';
    return this._sendRequest(endpoint, filters);
  }

  async getNodeDetails(vsn, { filters = null } = {}) {
    let endpoint = `/nodes/${vsn}`;
    return this._sendRequest(endpoint, filters);
  }

  async listSensors({ filters = null } = {}) {
    let endpoint = '/sensors';
    return this._sendRequest(endpoint, filters);
  }

  async getSensorDetails(path, { filters = null } = {}) {
    let endpoint = `/sensors/${path}`;
    return this._sendRequest(endpoint, filters);
  }

  async listObservations({ filters = null } = {}) {
    let endpoint = '/observations';
    return this._sendRequest(endpoint, filters);
  }

  async listRawObservations({ filters = null } = {}) {
    let endpoint = '/raw-observations';
    return this._sendRequest(endpoint, filters);
  }

  async _sendRequest(endpoint, filters) {
    let url = new URL(`${this.hostname}${endpoint}`);

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
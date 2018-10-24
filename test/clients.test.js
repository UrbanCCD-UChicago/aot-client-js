import fs from 'fs';

import 'chai';
import { expect } from 'chai';
import { fetchMock } from 'fetch-mock';

import { AotClient } from '../lib';

describe('AotClient', () => {
  let client = new AotClient();

  describe('#listProjects', () => {
    before(() => {
      let body = fs.readFileSync('test/fixtures/list-projects.json');
      fetchMock.get('*', JSON.parse(body));
    });

    it('should return the JSON response', async () => {
      let res = await client.listProjects();
      expect(res).to.be.an('object');
    });

    it('should have a meta object', async () => {
      let res = await client.listProjects();
      expect(res.meta).to.be.an('object');
    });

    it('should have a data array', async () => {
      let res = await client.listProjects();
      expect(res.data).to.be.an('array');
    });

    after(() => fetchMock.restore());
  });

  describe('#getProjectDetails', () => {
    before(() => {
      let body = fs.readFileSync('test/fixtures/get-project.json');
      fetchMock.get('*', JSON.parse(body));
    });

    it('should return the JSON response', async () => {
      let res = await client.getProjectDetails('chicago');
      expect(res).to.be.an('object');
    });

    it('should not have a meta object', async () => {
      let res = await client.getProjectDetails('chicago');
      expect(res.meta).to.equal(undefined);
    });

    it('should have a data object', async () => {
      let res = await client.getProjectDetails('chicago');
      expect(res.data).to.be.an('object');
    });

    after(() => fetchMock.restore());
  });

  describe('#listNodes', () => {
    before(() => {
      let body = fs.readFileSync('test/fixtures/list-nodes.json');
      fetchMock.get('*', JSON.parse(body));
    });

    it('should return the JSON response', async () => {
      let res = await client.listNodes();
      expect(res).to.be.an('object');
    });

    it('should have a meta object', async () => {
      let res = await client.listNodes();
      expect(res.meta).to.be.an('object');
    });

    it('should have a data array', async () => {
      let res = await client.listNodes();
      expect(res.data).to.be.an('array');
    });

    after(() => fetchMock.restore());
  });

  describe('#getNodeDetails', () => {
    before(() => {
      let body = fs.readFileSync('test/fixtures/get-node.json');
      fetchMock.get('*', JSON.parse(body));
    });

    it('should return the JSON response', async () => {
      let res = await client.getNodeDetails('004');
      expect(res).to.be.an('object');
    });

    it('should not have a meta object', async () => {
      let res = await client.getNodeDetails('004');
      expect(res.meta).to.equal(undefined);
    });

    it('should have a data object', async () => {
      let res = await client.getNodeDetails('004');
      expect(res.data).to.be.an('object');
    });

    after(() => fetchMock.restore());
  });

  describe('#listSensors', () => { 
    before(() => {
      let body = fs.readFileSync('test/fixtures/list-sensors.json');
      fetchMock.get('*', JSON.parse(body));
    });

    it('should return the JSON response', async () => {
      let res = await client.listSensors();
      expect(res).to.be.an('object');
    });

    it('should have a meta object', async () => {
      let res = await client.listSensors();
      expect(res.meta).to.be.an('object');
    });

    it('should have a data array', async () => {
      let res = await client.listSensors();
      expect(res.data).to.be.an('array');
    });

    after(() => fetchMock.restore());
  });

  describe('#getSensorDetails', () => {
    before(() => {
      let body = fs.readFileSync('test/fixtures/get-sensor.json');
      fetchMock.get('*', JSON.parse(body));
    });

    it('should return the JSON response', async () => {
      let res = await client.getSensorDetails('metsense.bmp180.temperature');
      expect(res).to.be.an('object');
    });

    it('should not have a meta object', async () => {
      let res = await client.getSensorDetails('metsense.bmp180.temperature');
      expect(res.meta).to.equal(undefined);
    });

    it('should have a data object', async () => {
      let res = await client.getSensorDetails('metsense.bmp180.temperature');
      expect(res.data).to.be.an('object');
    });

    after(() => fetchMock.restore());
  });

  describe('#listObservations', () => {
    before(() => {
      let body = fs.readFileSync('test/fixtures/list-observations.json');
      fetchMock.get('*', JSON.parse(body));
    });

    it('should return the JSON response', async () => {
      let res = await client.listObservations();
      expect(res).to.be.an('object');
    });

    it('should have a meta object', async () => {
      let res = await client.listObservations();
      expect(res.meta).to.be.an('object');
    });

    it('should have a data array', async () => {
      let res = await client.listObservations();
      expect(res.data).to.be.an('array');
    });

    after(() => fetchMock.restore());
  });

  describe('#listRawObservations', () => {
    before(() => {
      let body = fs.readFileSync('test/fixtures/list-raw-observations.json');
      fetchMock.get('*', JSON.parse(body));
    });

    it('should return the JSON response', async () => {
      let res = await client.listRawObservations();
      expect(res).to.be.an('object');
    });

    it('should have a meta object', async () => {
      let res = await client.listRawObservations();
      expect(res.meta).to.be.an('object');
    });

    it('should have a data array', async () => {
      let res = await client.listRawObservations();
      expect(res.data).to.be.an('array');
    });

    after(() => fetchMock.restore());
  });
});
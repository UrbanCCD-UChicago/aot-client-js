import fs from 'fs';

import 'chai';
import { expect } from 'chai';
import { fetchMock } from 'fetch-mock';

import { F, AotClient } from '../lib';


// omg js really?!
function compare(one, two) {
  // console.log(one);
  // console.log(two);
  let keys1 = Object.keys(one);
  let keys2 = Object.keys(two);
  expect(keys1.length).to.equal(keys2.length);
  
  for (var k in keys1) {
    let key = keys1[k];
    expect(keys2.indexOf(key)).to.not.equal(-1);

    let values1 = one[key];
    let values2 = two[key];
    expect(values1.length).to.equal(values2.length);

    for (var i = 0; i < values1.length; i++) {
      let group1 = values1[i];
      let group2 = values2[i];
      expect(group1.length).to.equal(group2.length);

      for (var j = 0; j < group1.length; j++) {
        let el1 = group1[j];
        let el2 = group2[j];
        expect(el1).to.equal(el2);
      }
    }
  }
}

describe('F', () => {
  describe('#constructor', () => {
    it('can be constructed with 2 args', () => {
      let f = new F('vince', 'awesome');
      let expected = {
        'vince': [['awesome']]
      };
      compare(f.filters, expected);
    });
    
    it('can be constructed with 3 args', () => {
      let f = new F('vince', 'is', 'awesome');
      let expected = {
        'vince': [['is', 'awesome']]
      };
      compare(f.filters, expected);
    });
    
    it('can be constructed with 9 args', () => {
      let f = new F('one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine');
      let expected = { 
        'one': [['two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine']] 
      };
      compare(f.filters, expected);
    });
  });

  describe('#and', () => {
    it('should add a new key/value when not already in filters', () => {
      let f = new F('value', 'lt', '42');
      f = f.and(new F('timestamp', 'ge', '2018-04-21T15:00:00'));
      let expected = {
        'value': [['lt', '42']],
        'timestamp': [['ge', '2018-04-21T15:00:00']]
      };
      compare(f.filters, expected);
    });
    
    it('should append the other filters to its own when there\'s a key collision', () => {
      let f = new F('timestamp', 'ge', '2018-04-21T15:00:00');
      f = f.and(new F('timestamp', 'lt', '2018-04-22T02:00:00'));
      let expected = {
        'timestamp': [
          ['ge', '2018-04-21T15:00:00'],
          ['lt', '2018-04-22T02:00:00']
        ]
      };
      compare(f.filters, expected);
    });
  });

  describe('#or', () => {
    it('should replace with the others key/value when there is a key collision', () => {
      let f = new F('timestamp', 'ge', '2018-04-21T15:00:00');
      f = f.or(new F('timestamp', 'lt', '2018-04-22T02:00:00'));
      let expected = {
        'timestamp': [['lt', '2018-04-22T02:00:00']]
      };
      compare(f.filters, expected);
    });
    
    it('should add the other key/value when not already in filters', () => {
      let f = new F('value', 'lt', '42');
      f = f.or(new F('timestamp', 'ge', '2018-04-21T15:00:00'));
      let expected = {
        'value': [['lt', '42']],
        'timestamp': [['ge', '2018-04-21T15:00:00']]
      };
      compare(f.filters, expected);
    });
  });

  describe('#toQueryParams', () => {
    before(() => {
      let body = fs.readFileSync('test/fixtures/list-observations.json');
      fetchMock.get('*', JSON.parse(body));
    });

    it('should dump its filters to an array of arrays', () => {
      let f = new F('value', 'lt', '42');
      f = f.and(new F('timestamp', 'ge', '2018-04-21T15:00:00'));
      
      let q = f.toQueryParams();
      expect(q.length).to.equal(2);
      expect(q[0][0]).to.equal('value');
      expect(q[0][1]).to.equal('lt:42');
      expect(q[1][0]).to.equal('timestamp');
      expect(q[1][1]).to.equal('ge:2018-04-21T15:00:00');
    });

    it('can be used in be used in sending a request', async () => {
      let f = new F('value', 'lt', '42');
      let client = new AotClient();
      await client.listObservations({filters: f});
    });

    after(() => fetchMock.restore());
  });
});
# Array of Things JavaScript Client

The Official JavaScript Client to the Array of Things API

## Installation and Usage

You can install this library from NPM:

```bash
$ npm install aot-client
```

The client provides simple functions to _get_ or _list_ different
entity types in the API. For detailed information about the API, its
endpoints, responses and available parameters visit
[https://arrayofthings.docs.apiary.io/#](https://arrayofthings.docs.apiary.io/#).

The one not-so-traditional thing about this client library is that it provides
a special `F` object to help build query parameters. We use some pretty verbose
params for many of our endpoints to expose some powerful features, and using `F`
objects helps alieviate having to get things formatted just right.

```javascript
import { AotClient, F } from 'aot_client';

let client = new AotClient();

// Let's say we want to get the average external temperature
// per node for the month of August 2018 as recorded by a
// specific sensor
let f = new F('by_sensor', 'metsense.bmp180.temperature');
f = f.and(new F('timestamp', 'ge', '2018-08-01T00:00:00'));
f = f.and(new F('timestamp', 'lt', '2018-09-01T00:00:00'));
f = f.and(new F('value', 'avg', 'node_vsn'));

let res = await client.listObservations({filters: f});
res.data
/*
[
  {
    "avg": 241.0,
    "group": "0A3"
  },
  {
    "avg": 9.45,
    "group": "052"
  },
  {
    "avg": 42.4,
    "group": "07F"
  },
  {
    "avg": 42.8,
    "group": "09C"
  },
  {
    "avg": 33.9,
    "group": "071"
  },
  {
    "avg": 37.8,
    "group": "890"
  },
  {
    "avg": 241.0,
    "group": "079"
  },
  ...
]
*/
```

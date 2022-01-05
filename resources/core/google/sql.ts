import * as random from '@pulumi/random';
import * as gcp from '@pulumi/gcp';
import { provider } from './provider';
import { project } from './project';

const name = 'core';

export const instance = new gcp.sql.DatabaseInstance(
  name,
  {
    name: name,
    databaseVersion: 'POSTGRES_13',
    region: 'europe-north1',
    settings: {
      tier: 'db-g1-small',
    },
  },
  { provider },
);

export const database = new gcp.sql.Database(
  name,
  {
    name,
    instance: instance.name,
  },
  { provider },
);

const password = new random.RandomPassword(name, {
  length: 32,
  overrideSpecial: '',
});

export const user = new gcp.sql.User(
  name,
  {
    instance: instance.name,
    name,
    password: password.result,
  },
  { provider },
);

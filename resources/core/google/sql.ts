import * as google from '@pulumi/google-native';
import { project } from './project';

export const instance = new google.sqladmin.v1beta4.Instance('core', {
  name: 'core',
  connectionName: 'core',
  databaseVersion: 'POSTGRES_13',
  instanceType: 'CLOUD_SQL_INSTANCE',
  project: project.projectId,
  region: 'europe-north1',
  settings: {
    tier: 'db-g1-small',
  },
});

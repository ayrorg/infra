import * as gcp from '@pulumi/gcp';
import * as pulumi from '@pulumi/pulumi';
import { provider } from './provider';
import { project } from './project';
import { database, instance, user } from './sql';
import { serviceAccount } from './app-engine';
import { sqlUsers } from '../config';

const name = 'core-database-creds';

export const databaseConfigSecret = new gcp.secretmanager.Secret(name, {
  secretId: 'core-database-creds',
  replication: { automatic: true },
  project: project.projectId,
});

export const databaseConfigSecretVersion = new gcp.secretmanager.SecretVersion(
  name,
  {
    secret: databaseConfigSecret.name,
    secretData: pulumi
      .all([instance.firstIpAddress, database.name, user.name, user.password])
      .apply(([host, database, username, password]) => ({
        host,
        username,
        password,
        database,
      }))
      .apply((v) => JSON.stringify(v)),
  },
  { provider },
);

export const secretIam = new gcp.secretmanager.SecretIamBinding(
  name,
  {
    members: [
      ...sqlUsers.map((u) => `user:${u}`),
      pulumi.interpolate`serviceAccount:${serviceAccount.email}`,
    ],
    role: 'roles/secretmanager.secretAccessor',
    secretId: databaseConfigSecret.id,
  },
  { provider },
);

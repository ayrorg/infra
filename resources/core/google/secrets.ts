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
      .all([instance, database, user])
      .apply(([i, d, u]) => ({
        host: i.firstIpAddress,
        username: u.name,
        password: u.password,
        database: d.name,
      }))
      .apply((v) => JSON.stringify(v)),
  },
  { provider },
);

export const secretIam = new gcp.secretmanager.SecretIamBinding(
  'sa-secret-access',
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

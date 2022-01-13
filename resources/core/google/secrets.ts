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

export const secretSaIam = new gcp.secretmanager.SecretIamMember(
  `${name}-sa-user`,
  {
    member: pulumi.interpolate`serviceAccount:${serviceAccount.email}`,
    role: 'roles/secretmanager.secretAccessor',
    secretId: databaseConfigSecret.id,
  },
  { provider },
);

export const secrets = sqlUsers.map(
  (u) =>
    new gcp.secretmanager.SecretIamMember(
      `${name}-${u}`,
      {
        member: `user:${u}`,
        role: 'roles/secretmanager.secretAccessor',
        secretId: databaseConfigSecret.id,
      },
      { provider },
    ),
);

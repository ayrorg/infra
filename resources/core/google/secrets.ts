import * as gcp from '@pulumi/gcp';
import * as pulumi from '@pulumi/pulumi';
import { provider } from './provider';
import { project } from './project';
import { database, instance, user } from './sql';
import { serviceAccount } from './app-engine';

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
    secretData: pulumi.all([instance, database, user]).apply(([i, d, u]) =>
      JSON.stringify({
        host: i.firstIpAddress,
        username: u.name,
        password: u.password,
        database: d.name,
      }),
    ),
  },
  { provider },
);

export const secretIam = new gcp.secretmanager.SecretIamMember(
  'sa-secret-access',
  {
    member: pulumi.interpolate`serviceAccount:${serviceAccount.email}`,
    role: 'roles/secretmanager.secretAccessor',
    secretId: databaseConfigSecret.id,
  },
  { provider },
);

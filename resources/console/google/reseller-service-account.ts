import * as google from '@pulumi/google-native';
import * as gcp from '@pulumi/gcp';
import { consoleProject } from './project';
import { provider } from './provider';
import { viewerUsers } from '../config';
import { interpolate } from '@pulumi/pulumi';
import { service } from '../services/workspace-agent/workspace-agent';

export const serviceAccount = new google.iam.v1.ServiceAccount(
  'reseller-admin-sa',
  {
    accountId: 'reseller-admin',
    project: consoleProject.projectId,
  },
  { dependsOn: consoleProject },
);

export const serviceAccountKey = new gcp.serviceaccount.Key(
  'reseller-sa-key',
  {
    serviceAccountId: serviceAccount.name,
  },
  { dependsOn: consoleProject, provider },
);

export const secret = new gcp.secretmanager.Secret('reseller-sa-key', {
  project: consoleProject.projectId,
  secretId: 'reseller-sa-key',
  replication: { automatic: true },
});

export const iam = new google.secretmanager.v1.SecretIamPolicy(
  'reseller-sa-key-iam',
  {
    secretId: secret.secretId,
    project: consoleProject.projectId,
    bindings: [
      {
        members: [
          ...viewerUsers.map((u) => interpolate`user:${u}`),
          interpolate`serviceAccount:${service.serviceAccount.email}`,
        ],
        role: 'roles/secretmanager.secretAccessor',
      },
    ],
  },
);

export const secretVersion = new gcp.secretmanager.SecretVersion(
  'reseller-sa-key',
  {
    secret: secret.name,
    secretData: serviceAccountKey.privateKey,
  },
  { provider },
);

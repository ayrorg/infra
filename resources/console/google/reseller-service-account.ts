import * as google from '@pulumi/google-native';
import * as gcp from '@pulumi/gcp';
import { consoleProject } from './project';
import { provider } from './provider';

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

export const secret = new google.secretmanager.v1.Secret('reseller-sa-key', {
  project: consoleProject.projectId,
  secretId: 'reseller-sa-key',
  replication: { automatic: {} },
});

// TODO: Give service account access to it and developers(?).
// export const iam = new google.secretmanager.v1.SecretIamPolicy('reseller-sa-key-iam', {

// })

export const secretVersion = new gcp.secretmanager.SecretVersion(
  'reseller-sa-key',
  {
    secret: secret.name,
    secretData: serviceAccountKey.privateKey,
  },
  { provider },
);

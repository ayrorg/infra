import * as google from '@pulumi/google-native';
import * as gcp from '@pulumi/gcp';
import { project } from './project';
import { provider } from './provider';

export const serviceAccount = new google.iam.v1.ServiceAccount(
  'core-deploy-sa',
  {
    accountId: 'deploy',
    project: project.projectId,
  },
);

export const serviceAccountKey = new gcp.serviceaccount.Key(
  'core-deploy-sa-key',
  {
    serviceAccountId: serviceAccount.name,
  },
  { provider },
);

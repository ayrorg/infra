import * as google from '@pulumi/google-native';
import * as gcp from '@pulumi/gcp';
import { project } from './project';
import { provider } from './provider';

export const serviceAccount = new google.iam.v1.ServiceAccount(
  'onboarding-deploy-sa',
  {
    accountId: 'deploy',
    project: project.projectID,
  },
  { provider },
);

export const serviceAccountKey = new gcp.serviceaccount.Key(
  'onboarding-deploy-sa-key',
  {
    serviceAccountId: serviceAccount.name,
  },
  { provider },
);

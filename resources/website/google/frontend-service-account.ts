import * as google from '@pulumi/google-native';
import * as gcp from '@pulumi/gcp';
import { websiteProject } from './project';

export const serviceAccount = new google.iam.v1.ServiceAccount(
  'deploy-sa',
  {
    accountId: 'frontend-deploy',
    project: websiteProject.projectID,
  },
  { dependsOn: websiteProject },
);

export const serviceAccountKey = new gcp.serviceaccount.Key(
  'service-account-key',
  {
    serviceAccountId: serviceAccount.uniqueId,
  },
  { dependsOn: websiteProject },
);

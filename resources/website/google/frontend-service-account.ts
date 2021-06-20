import * as google from '@pulumi/google-native';
import { websiteProject } from './project';

export const serviceAccount = new google.iam.v1.ServiceAccount(
  'deploy-sa',
  {
    accountId: 'frontend-deploy',
    project: websiteProject.projectID,
  },
  { dependsOn: websiteProject },
);

export const serviceAccountKey = new google.iam.v1.Key(
  'service-account-key',
  {
    serviceAccountId: serviceAccount.uniqueId,
    project: websiteProject.projectID,
  },
  { dependsOn: websiteProject },
);

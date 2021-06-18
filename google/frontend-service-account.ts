import * as google from '@pulumi/google-native';
import { apiServices } from './api-services';
import { project } from './config';

export const serviceAccount = new google.iam.v1.ServiceAccount(
  'deploy-sa',
  {
    accountId: 'frontend-deploy',
    project,
  },
  { dependsOn: apiServices },
);

export const serviceAccountKey = new google.iam.v1.Key(
  'service-account-key',
  {
    serviceAccountId: serviceAccount.name,
    project,
  },
  { dependsOn: apiServices },
);

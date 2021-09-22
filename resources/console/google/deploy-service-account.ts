import * as google from '@pulumi/google-native';
import * as gcp from '@pulumi/gcp';
import { consoleProject } from './project';
import { provider } from './provider';

export const serviceAccount = new google.iam.v1.ServiceAccount(
  'console-deploy-sa',
  {
    accountId: 'deploy',
    project: consoleProject.projectId,
  },
  { dependsOn: consoleProject },
);

export const serviceAccountKey = new gcp.serviceaccount.Key(
  'console-deploy-sa-key',
  {
    serviceAccountId: serviceAccount.name,
  },
  { dependsOn: consoleProject, provider },
);

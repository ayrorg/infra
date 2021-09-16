import * as google from '@pulumi/google-native';
import { consoleProject } from './project';

export const serviceAccount = new google.iam.v1.ServiceAccount(
  'console-deploy-sa',
  {
    accountId: 'deploy',
    project: consoleProject.projectId,
  },
  { dependsOn: consoleProject },
);

export const serviceAccountKey = new google.iam.v1.Key(
  'console-deploy-sa-key',
  {
    serviceAccountId: serviceAccount.uniqueId,
    project: consoleProject.projectId,
  },
  { dependsOn: consoleProject },
);

import * as google from '@pulumi/google-native';
import { interpolate } from '@pulumi/pulumi';
import { consoleProject } from './project';
import { serviceAccount } from './deploy-service-account';
import { apiServices } from './api-services';
import { provider } from './provider';

new google.storage.v1.BucketIamPolicy(
  'console-artifact-iam-policies',
  {
    bucket: interpolate`eu.artifacts.${consoleProject.projectId}.appspot.com`,
    bindings: [
      {
        role: 'roles/storage.admin',
        members: [interpolate`serviceAccount:${serviceAccount.email}`],
      },
    ],
  },
  {
    dependsOn: apiServices,
  },
);

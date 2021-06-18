import * as google from '@pulumi/google-native';
import { interpolate } from '@pulumi/pulumi';
import { apiServices } from './api-services';
import { project } from './config';
import { serviceAccount } from './frontend-service-account';

export const projectIamPolicy = new google.cloudresourcemanager.v1.ProjectIamPolicy(
  'project-iam-policy',
  {
    resource: project,
    bindings: [
      {
        members: [interpolate`serviceAccount:${serviceAccount.email}`],
        role: 'roles/firebasehosting.admin',
      },
    ],
  },
  { dependsOn: apiServices },
);

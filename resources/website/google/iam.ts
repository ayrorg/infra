import * as google from '@pulumi/google-native';
import { interpolate } from '@pulumi/pulumi';
import { websiteProject } from './project';
import { serviceAccount } from './frontend-service-account';

export const projectIamPolicy = new google.cloudresourcemanager.v1.ProjectIamPolicy(
  'project-iam-policy',
  {
    resource: websiteProject.projectID,
    bindings: [
      {
        members: [interpolate`serviceAccount:${serviceAccount.email}`],
        role: 'roles/firebasehosting.admin',
      },
    ],
  },
  { dependsOn: websiteProject },
);

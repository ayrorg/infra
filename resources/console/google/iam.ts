import * as google from '@pulumi/google-native';
import { interpolate } from '@pulumi/pulumi';
import { viewerUsers } from '../config';
import { consoleProject } from './project';
import { serviceAccount } from './deploy-service-account';

export const projectIamPolicy = new google.cloudresourcemanager.v1.ProjectIamPolicy(
  'console-iam-policy',
  {
    resource: consoleProject.projectId,
    bindings: [
      ...viewerUsers.map((u) => ({
        members: [interpolate`user:${u}`],
        role: 'roles/viewer',
      })),
      {
        members: [
          'serviceAccount:service-702460706354@gcf-admin-robot.iam.gserviceaccount.com',
        ],
        role: 'roles/cloudfunctions.serviceAgent',
      },
      {
        members: [
          'serviceAccount:451937147092@cloudservices.gserviceaccount.com',
          interpolate`serviceAccount:${serviceAccount.email}`,
        ],
        role: 'roles/editor',
      },
    ],
  },
  { dependsOn: consoleProject },
);

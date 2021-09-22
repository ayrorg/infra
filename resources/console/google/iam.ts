import * as google from '@pulumi/google-native';
import { interpolate } from '@pulumi/pulumi';
import { viewerUsers } from '../config';
import { consoleProject } from './project';
import { deployServiceAccountEmail } from '../../config';

export const projectIamPolicy = new google.cloudresourcemanager.v1.ProjectIamPolicy(
  'console-iam-policy',
  {
    resource: consoleProject.projectId,
    bindings: [
      {
        members: viewerUsers.map((u) => interpolate`user:${u}`),
        role: 'roles/viewer',
      },
      {
        members: [
          'serviceAccount:service-702460706354@gcf-admin-robot.iam.gserviceaccount.com',
        ],
        role: 'roles/cloudfunctions.serviceAgent',
      },
      {
        members: [
          'serviceAccount:451937147092@cloudservices.gserviceaccount.com',
          'serviceAccount:451937147092@cloudbuild.gserviceaccount.com',
          'serviceAccount:451937147092-compute@developer.gserviceaccount.com',
        ],
        role: 'roles/editor',
      },
      {
        members: [interpolate`serviceAccount:${deployServiceAccountEmail}`],
        role: 'roles/owner',
      },
    ],
  },
  { dependsOn: consoleProject },
);

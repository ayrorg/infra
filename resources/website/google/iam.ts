import * as google from '@pulumi/google-native';
import { interpolate } from '@pulumi/pulumi';
import { websiteProject } from './project';
import { serviceAccount } from './frontend-service-account';
import { viewerUsers } from '../config';

export const projectIamPolicy =
  new google.cloudresourcemanager.v1.ProjectIamPolicy(
    'project-iam-policy',
    {
      resource: websiteProject.projectID,
      bindings: [
        {
          members: [interpolate`serviceAccount:${serviceAccount.email}`],
          role: 'roles/firebasehosting.admin',
        },
        ...viewerUsers.map((u) => ({
          members: [interpolate`user:${u}`],
          role: 'roles/viewer',
        })),
      ],
    },
    { dependsOn: websiteProject },
  );

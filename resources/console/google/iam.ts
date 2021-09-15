import * as google from '@pulumi/google-native';
import { interpolate } from '@pulumi/pulumi';
import { viewerUsers } from '../config';
import { consoleProject } from './project';

export const projectIamPolicy =
  new google.cloudresourcemanager.v1.ProjectIamPolicy(
    'console-iam-policy',
    {
      resource: consoleProject.projectId,
      bindings: [
        ...viewerUsers.map((u) => ({
          members: [interpolate`user:${u}`],
          role: 'roles/viewer',
        })),
      ],
    },
    { dependsOn: consoleProject },
  );

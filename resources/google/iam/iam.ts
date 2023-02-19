import * as google from '@pulumi/google-native';
import { interpolate } from '@pulumi/pulumi';
import { serviceAccount as calendarAgentServiceAccount } from '../../apps/calendar-agent/service-account';
import { developers } from '../../config';
import { project } from '../project';
import { googleIamGrantRoles } from './google-iam-grant-roles';

export const projectIamPolicy =
  new google.cloudresourcemanager.v1.ProjectIamPolicy('main-iam-policy', {
    resource: project.projectId,
    bindings: [
      {
        members: developers.map((u) => interpolate`user:${u}`),
        role: 'roles/viewer',
      },
      {
        members: [
          interpolate`serviceAccount:${calendarAgentServiceAccount.email}`,
        ],
        role: 'roles/datastore.user',
      },
      // Google-provided bindings
      ...googleIamGrantRoles,
    ],
  });

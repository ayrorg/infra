import * as google from '@pulumi/google-native';
import { interpolate } from '@pulumi/pulumi';
import { viewerUsers, sqlUsers } from '../config';
import { project } from './project';
import { deployServiceAccountEmail } from '../../config';
import { serviceAccount as deployServiceAccount } from './deploy-service-account';
import { serviceAccount as appEngineServiceAccount } from './app-engine';

export const projectIamPolicy =
  new google.cloudresourcemanager.v1.ProjectIamPolicy(
    'core-iam-policy',
    {
      resource: project.projectId,
      bindings: [
        {
          members: viewerUsers.map((u) => interpolate`user:${u}`),
          role: 'roles/viewer',
        },
        {
          members: viewerUsers.map((u) => interpolate`user:${u}`),
          role: 'roles/serviceusage.serviceUsageConsumer',
        },
        {
          members: sqlUsers.map((u) => interpolate`user:${u}`),
          role: 'roles/cloudsql.editor',
        },
        {
          members: [
            interpolate`serviceAccount:${project.number}@cloudservices.gserviceaccount.com`,
            interpolate`serviceAccount:${project.number}-compute@developer.gserviceaccount.com`,
            interpolate`serviceAccount:service-${project.number}@containerregistry.iam.gserviceaccount.com`,
          ],
          role: 'roles/editor',
        },
        {
          members: [
            interpolate`serviceAccount:${deployServiceAccountEmail}`, // Core deployment service account
          ],
          role: 'roles/owner',
        },
        // Google-provided role grants
        {
          members: [
            interpolate`serviceAccount:${project.number}@cloudbuild.gserviceaccount.com`,
          ],
          role: 'roles/cloudbuild.builds.builder',
        },
        {
          members: [
            interpolate`serviceAccount:service-${project.number}@gcp-sa-cloudbuild.iam.gserviceaccount.com`,
          ],
          role: 'roles/cloudbuild.serviceAgent',
        },
        {
          members: [
            interpolate`serviceAccount:service-${project.number}@gcf-admin-robot.iam.gserviceaccount.com`,
          ],
          role: 'roles/cloudfunctions.serviceAgent',
        },
        {
          members: [
            interpolate`serviceAccount:service-${project.number}@compute-system.iam.gserviceaccount.com`,
          ],
          role: 'roles/compute.serviceAgent',
        },
        {
          members: [
            interpolate`serviceAccount:service-${project.number}@container-engine-robot.iam.gserviceaccount.com`,
          ],
          role: 'roles/container.serviceAgent',
        },
        {
          members: [interpolate`serviceAccount:${deployServiceAccount.email}`],
          role: 'roles/appengine.appAdmin',
        },
        {
          members: [interpolate`serviceAccount:${deployServiceAccount.email}`],
          role: 'roles/iam.serviceAccountUser',
        },
        {
          members: [interpolate`serviceAccount:${deployServiceAccount.email}`],
          role: 'roles/compute.storageAdmin',
        },
        {
          members: [interpolate`serviceAccount:${deployServiceAccount.email}`],
          role: 'roles/storage.admin',
        },
        {
          members: [interpolate`serviceAccount:${deployServiceAccount.email}`],
          role: 'roles/cloudbuild.builds.editor',
        },
        {
          members: [interpolate`serviceAccount:${deployServiceAccount.email}`],
          role: 'roles/cloudscheduler.admin',
        },
        {
          members: [
            interpolate`serviceAccount:${project.number}-compute@developer.gserviceaccount.com`,
          ],
          role: 'roles/cloudtrace.agent',
        },
        {
          members: [
            interpolate`serviceAccount:${appEngineServiceAccount.email}`,
          ],
          role: 'roles/cloudsql.client',
        },
      ],
    },
    { dependsOn: project },
  );

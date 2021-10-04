import * as google from '@pulumi/google-native';
import { interpolate } from '@pulumi/pulumi';
import { viewerUsers } from '../config';
import { consoleProject } from './project';
import { deployServiceAccountEmail } from '../../config';
import { serviceAccount as resellerServiceAccount } from './reseller-service-account';
import { serviceAccount as workspaceAgentSa } from '../services/workspace-agent/service-account';

export const projectIamPolicy =
  new google.cloudresourcemanager.v1.ProjectIamPolicy(
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
            interpolate`serviceAccount:${consoleProject.number}@cloudservices.gserviceaccount.com`,
            interpolate`serviceAccount:${consoleProject.number}-compute@developer.gserviceaccount.com`,
            interpolate`serviceAccount:service-${consoleProject.number}@containerregistry.iam.gserviceaccount.com`,
          ],
          role: 'roles/editor',
        },
        {
          members: [
            interpolate`serviceAccount:${deployServiceAccountEmail}`,
            'user:so@ayr.no',
          ],
          role: 'roles/owner',
        },
        {
          members: [
            interpolate`serviceAccount:${resellerServiceAccount.email}`,
          ],
          role: 'roles/pubsub.editor',
        },
        // Google-provided role grants
        {
          members: [
            interpolate`serviceAccount:${consoleProject.number}@cloudbuild.gserviceaccount.com`,
          ],
          role: 'roles/cloudbuild.builds.builder',
        },
        {
          members: [
            interpolate`serviceAccount:service-${consoleProject.number}@gcp-sa-cloudbuild.iam.gserviceaccount.com`,
          ],
          role: 'roles/cloudbuild.serviceAgent',
        },
        {
          members: [
            interpolate`serviceAccount:service-${consoleProject.number}@gcf-admin-robot.iam.gserviceaccount.com`,
          ],
          role: 'roles/cloudfunctions.serviceAgent',
        },
        {
          members: [
            interpolate`serviceAccount:service-${consoleProject.number}@compute-system.iam.gserviceaccount.com`,
          ],
          role: 'roles/compute.serviceAgent',
        },
        {
          members: [
            interpolate`serviceAccount:service-${consoleProject.number}@container-engine-robot.iam.gserviceaccount.com`,
          ],
          role: 'roles/container.serviceAgent',
        },
        {
          members: [
            interpolate`serviceAccount:firebase-service-account@firebase-sa-management.iam.gserviceaccount.com`,
          ],
          role: 'roles/firebase.managementServiceAgent',
        },
        {
          members: [
            interpolate`serviceAccount:service-${consoleProject.number}@firebase-rules.iam.gserviceaccount.com`,
          ],
          role: 'roles/firebaserules.system',
        },
        {
          members: [
            interpolate`serviceAccount:service-${consoleProject.number}@serverless-robot-prod.iam.gserviceaccount.com`,
          ],
          role: 'roles/run.serviceAgent',
        },
        {
          members: [
            interpolate`serviceAccount:service-${consoleProject.number}@gcp-sa-pubsub.iam.gserviceaccount.com`,
          ],
          role: 'roles/iam.serviceAccountTokenCreator',
        },
        {
          members: [
            interpolate`serviceAccount:${workspaceAgentSa.email}`,
            ...viewerUsers.map((u) => interpolate`user:${u}`),
          ],
          role: 'roles/bigquery.user',
        },
      ],
    },
    { dependsOn: consoleProject },
  );

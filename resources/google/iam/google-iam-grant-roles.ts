import { interpolate } from "@pulumi/pulumi";
import { project } from "../project";

const projectNumber = project.number;

export const googleIamGrantRoles = [
  {
    members: [
      interpolate`serviceAccount:${projectNumber}@cloudbuild.gserviceaccount.com`,
    ],
    role: 'roles/cloudbuild.builds.builder',
  },
  {
    members: [
      interpolate`serviceAccount:service-${projectNumber}@gcp-sa-cloudbuild.iam.gserviceaccount.com`,
    ],
    role: 'roles/cloudbuild.serviceAgent',
  },
  {
    members: [
      interpolate`serviceAccount:service-${projectNumber}@gcf-admin-robot.iam.gserviceaccount.com`,
    ],
    role: 'roles/cloudfunctions.serviceAgent',
  },
  {
    members: [
      interpolate`serviceAccount:service-${projectNumber}@compute-system.iam.gserviceaccount.com`,
    ],
    role: 'roles/compute.serviceAgent',
  },
  {
    members: [
      interpolate`serviceAccount:service-${projectNumber}@container-engine-robot.iam.gserviceaccount.com`,
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
      interpolate`serviceAccount:service-${projectNumber}@firebase-rules.iam.gserviceaccount.com`,
    ],
    role: 'roles/firebaserules.system',
  },
  {
    members: [
      interpolate`serviceAccount:service-${projectNumber}@serverless-robot-prod.iam.gserviceaccount.com`,
    ],
    role: 'roles/run.serviceAgent',
  },
  {
    members: [
      interpolate`serviceAccount:service-${projectNumber}@gcp-sa-pubsub.iam.gserviceaccount.com`,
    ],
    role: 'roles/iam.serviceAccountTokenCreator',
  },
  {
    members: [
      interpolate`serviceAccount:${projectNumber}@cloudservices.gserviceaccount.com`,
      interpolate`serviceAccount:${projectNumber}-compute@developer.gserviceaccount.com`,
      interpolate`serviceAccount:service-${projectNumber}@containerregistry.iam.gserviceaccount.com`,
    ],
    role: 'roles/editor',
  },
];

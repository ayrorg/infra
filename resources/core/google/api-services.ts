import * as gcp from '@pulumi/gcp';
import { provider } from './provider';
import { project } from './project';

export const services = [
  'cloudbuild.googleapis.com',
  'cloudresourcemanager.googleapis.com',
  'serviceusage.googleapis.com',
  'servicemanagement.googleapis.com',
  'servicecontrol.googleapis.com',
  'container.googleapis.com',
  'compute.googleapis.com',
  'logging.googleapis.com',
  'stackdriver.googleapis.com',
  'monitoring.googleapis.com',
  'cloudtrace.googleapis.com',
  'clouderrorreporting.googleapis.com',
  'clouddebugger.googleapis.com',
  'cloudprofiler.googleapis.com',
  'cloudfunctions.googleapis.com',
  'iam.googleapis.com',
  'appengine.googleapis.com',
  'secretmanager.googleapis.com',
];

export const apiServices = services.map(
  (service) =>
    new gcp.projects.Service(
      `core-${service}`,
      {
        service,
        disableOnDestroy: false,
        project: project.projectId,
      },
      { provider },
    ),
);

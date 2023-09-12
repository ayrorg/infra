import * as gcp from '@pulumi/gcp';
import { billingAccount, organizationId, projectName } from '../config';

export const project = new gcp.organizations.Project(
  'apps-main-project',
  {
    autoCreateNetwork: true,
    billingAccount: billingAccount,
    orgId: organizationId,
    name: projectName,
    projectId: projectName,
  },
  { protect: true },
);

export const services = [
  'serviceusage.googleapis.com',
  'servicemanagement.googleapis.com',
  'servicecontrol.googleapis.com',
  'container.googleapis.com',
  'compute.googleapis.com',
  'dns.googleapis.com',
  'cloudresourcemanager.googleapis.com',
  'logging.googleapis.com',
  'stackdriver.googleapis.com',
  'monitoring.googleapis.com',
  'cloudtrace.googleapis.com',
  'clouderrorreporting.googleapis.com',
  'cloudprofiler.googleapis.com',
  'sqladmin.googleapis.com',
  'cloudkms.googleapis.com',
  'cloudfunctions.googleapis.com',
  'run.googleapis.com',
  'cloudbuild.googleapis.com',
  'iam.googleapis.com',
  'cloudbilling.googleapis.com',
  'appengine.googleapis.com',
  'secretmanager.googleapis.com',
  'artifactregistry.googleapis.com',
  'calendar-json.googleapis.com',
];

export const apiServices = services.map(
  (service) =>
    new gcp.projects.Service(
      `main-${service}`,
      {
        service,
        disableOnDestroy: false,
        project: project.name,
      },
      { dependsOn: project },
    ),
);

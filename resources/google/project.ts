import * as gcp from '@pulumi/gcp';
import * as google from '@pulumi/google-native';
import {
  billingAccount,
  organizationId,
  projectName,
  region,
  zone,
} from '../config';

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
  'clouddebugger.googleapis.com',
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

export const provider = {
  gcp: new gcp.Provider(
    'main-gcp',
    {
      project: project.projectId,
    },
    { dependsOn: apiServices },
  ),
  google: new google.Provider(
    'main-google',
    {
      project: project.projectId,
      region,
      zone,
    },
    { dependsOn: apiServices },
  ),
};

export const providers = [provider.gcp, provider.google];

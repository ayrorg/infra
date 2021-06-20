import * as scaffold from '@cobraz/pulumi-gcp-scaffold';
import { apiServices } from '../../google/api-services';
import { billingAccount, organizationId } from '../../google/config';
import { project } from '../config';

export const websiteProject = new scaffold.Project(
  'website',
  {
    projectID: project,
    billingAccountID: billingAccount,
    orgID: organizationId,
    activatedApis: [
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
    ],
  },
  { dependsOn: apiServices },
);

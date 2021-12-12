import { projectName } from '../config';
import * as gcp from '@pulumi/gcp';
import { billingAccount, organizationId } from '../../google/config';

export const project = new gcp.organizations.Project(
  'ayr-onboarding-project',
  {
    autoCreateNetwork: true,
    billingAccount: billingAccount,
    orgId: organizationId,
    name: projectName,
    projectId: projectName,
  },
  { protect: true },
);

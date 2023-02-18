import * as gcp from '@pulumi/gcp';
import { billingAccount, organizationId } from '../../google/config';

export const consoleProject = new gcp.organizations.Project(
  'ayr-console-project',
  {
    autoCreateNetwork: true,
    billingAccount: billingAccount,
    orgId: organizationId,
    name: 'Console',
    projectId: 'ayr-console',
  },
  { protect: true },
);

import * as gcp from '@pulumi/gcp';
import { billingAccount, organizationId } from '../../google/config';
import { project } from '../config';

export const websiteProject = new gcp.organizations.Project(
  'website',
  {
    autoCreateNetwork: true,
    billingAccount: billingAccount,
    orgId: organizationId,
    name: project,
    projectId: project,
  },
  {
    protect: true,
    aliases: [
      {
        parent:
          'urn:pulumi:prod::infra-core::gcp-scaffold:index:project::website',
        name: 'website-ayr-website',
      },
    ],
  },
);

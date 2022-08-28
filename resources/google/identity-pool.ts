import * as gcp from '@pulumi/gcp';
import * as pulumi from '@pulumi/pulumi';
import { provider as gcpProvider } from './provider';
import { serviceAccount as dockerServiceAccount } from './deployment-service-accounts/docker';
import { repositoriesWithDocker } from '../config';

const owner = 'ayrorg';

const identityPool = new gcp.iam.WorkloadIdentityPool(
  'core-github-actions',
  {
    disabled: false,
    workloadIdentityPoolId: 'github-actions',
  },
  { provider: gcpProvider },
);

export const identityPoolProvider = new gcp.iam.WorkloadIdentityPoolProvider(
  'core-github-actions',
  {
    workloadIdentityPoolId: identityPool.workloadIdentityPoolId,
    workloadIdentityPoolProviderId: 'github-actions',
    oidc: {
      issuerUri: 'https://token.actions.githubusercontent.com',
    },
    attributeMapping: {
      'google.subject': 'assertion.sub',
      'attribute.actor': 'assertion.actor',
      'attribute.repository': 'assertion.repository',
    },
  },
  { provider: gcpProvider },
);

repositoriesWithDocker.map((repo) => [
  new gcp.serviceaccount.IAMMember(
    `core-iam-service-${repo}`,
    {
      serviceAccountId: dockerServiceAccount.name,
      role: 'roles/iam.workloadIdentityUser',
      member: pulumi.interpolate`principalSet://iam.googleapis.com/${identityPool.name}/attribute.repository/${owner}/${repo}`,
    },
    { provider: gcpProvider, deleteBeforeReplace: true },
  ),
  new gcp.serviceaccount.IAMMember(
    `core-iam-service-token-${repo}`,
    {
      serviceAccountId: dockerServiceAccount.name,
      role: 'roles/iam.serviceAccountTokenCreator',
      member: pulumi.interpolate`principalSet://iam.googleapis.com/${identityPool.name}/attribute.repository/${owner}/${repo}`,
    },
    { provider: gcpProvider, deleteBeforeReplace: true },
  ),
]);

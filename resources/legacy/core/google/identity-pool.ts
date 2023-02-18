import * as gcp from '@pulumi/gcp';
import * as pulumi from '@pulumi/pulumi';
import { provider } from './provider';
import { serviceAccount as dockerServiceAccount } from './deployment-service-accounts/docker';
import { serviceAccount as gkeServiceAccount } from './deployment-service-accounts/gke';
import { infraRepositories } from '../config';

const owner = 'ayrorg';

const identityPool = new gcp.iam.WorkloadIdentityPool(
  'core-github-actions',
  {
    disabled: false,
    workloadIdentityPoolId: 'core-github-actions',
  },
  { provider },
);

export const identityPoolProvider = new gcp.iam.WorkloadIdentityPoolProvider(
  'core-github-actions',
  {
    workloadIdentityPoolId: identityPool.workloadIdentityPoolId,
    workloadIdentityPoolProviderId: 'core-github-actions',
    oidc: {
      issuerUri: 'https://token.actions.githubusercontent.com',
    },
    attributeMapping: {
      'google.subject': 'assertion.sub',
      'attribute.actor': 'assertion.actor',
      'attribute.repository': 'assertion.repository',
    },
  },
  { provider },
);

infraRepositories.map((repo) => [
  new gcp.serviceaccount.IAMMember(
    `gke-iam-${repo}`,
    {
      serviceAccountId: gkeServiceAccount.name,
      role: 'roles/iam.workloadIdentityUser',
      member: pulumi.interpolate`principalSet://iam.googleapis.com/${identityPool.name}/attribute.repository/${owner}/${repo}`,
    },
    { provider, deleteBeforeReplace: true },
  ),
  new gcp.serviceaccount.IAMMember(
    `gke-iam-token-${repo}`,
    {
      serviceAccountId: gkeServiceAccount.name,
      role: 'roles/iam.serviceAccountTokenCreator',
      member: pulumi.interpolate`principalSet://iam.googleapis.com/${identityPool.name}/attribute.repository/${owner}/${repo}`,
    },
    { provider, deleteBeforeReplace: true },
  ),
]);

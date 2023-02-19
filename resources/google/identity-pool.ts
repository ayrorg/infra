import * as gcp from '@pulumi/gcp';
import * as pulumi from '@pulumi/pulumi';
import { provider } from './providers';
import { repositoriesWithContainers } from '../config';
import { serviceAccount } from './container-service-account';

const owner = 'ayrorg';

const identityPool = new gcp.iam.WorkloadIdentityPool(
  'main-identity-pool',
  {
    disabled: false,
    workloadIdentityPoolId: 'github-workload-identity',
  },
  { provider: provider.gcp },
);

export const identityPoolProvider = new gcp.iam.WorkloadIdentityPoolProvider(
  'main-identity-pool-provider',
  {
    workloadIdentityPoolId: identityPool.workloadIdentityPoolId,
    workloadIdentityPoolProviderId: 'github-workload-identity',
    oidc: {
      issuerUri: 'https://token.actions.githubusercontent.com',
    },
    attributeMapping: {
      'google.subject': 'assertion.sub',
      'attribute.actor': 'assertion.actor',
      'attribute.repository': 'assertion.repository',
    },
  },
  { provider: provider.gcp },
);

repositoriesWithContainers.map((repo) => [
  new gcp.serviceaccount.IAMMember(
    `core-iam-service-${repo}`,
    {
      serviceAccountId: serviceAccount.name,
      role: 'roles/iam.workloadIdentityUser',
      member: pulumi.interpolate`principalSet://iam.googleapis.com/${identityPool.name}/attribute.repository/${owner}/${repo}`,
    },
    { provider: provider.gcp, deleteBeforeReplace: true },
  ),
  new gcp.serviceaccount.IAMMember(
    `core-iam-service-token-${repo}`,
    {
      serviceAccountId: serviceAccount.name,
      role: 'roles/iam.serviceAccountTokenCreator',
      member: pulumi.interpolate`principalSet://iam.googleapis.com/${identityPool.name}/attribute.repository/${owner}/${repo}`,
    },
    { provider: provider.gcp, deleteBeforeReplace: true },
  ),
]);

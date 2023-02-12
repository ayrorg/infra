import * as gcp from '@pulumi/gcp';
import * as pulumi from '@pulumi/pulumi';
import {
  microserviceRepositories,
} from '../config';
import { provider as gcpProvider } from './provider';
import { serviceAccount as serviceServiceAccount } from './deployment-service-accounts/service';

const owner = 'ayrorg';

const identityPool = new gcp.iam.WorkloadIdentityPool(
  'github-actions',
  {
    disabled: false,
    workloadIdentityPoolId: 'github-actions',
  },
  { provider: gcpProvider },
);

export const identityPoolProvider = new gcp.iam.WorkloadIdentityPoolProvider(
  'github-actions',
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

microserviceRepositories.map((repo) => [
  new gcp.serviceaccount.IAMMember(
    `iam-service-${repo}`,
    {
      serviceAccountId: serviceServiceAccount.name,
      role: 'roles/iam.workloadIdentityUser',
      member: pulumi.interpolate`principalSet://iam.googleapis.com/${identityPool.name}/attribute.repository/${owner}/${repo}`,
    },
    { provider: gcpProvider, deleteBeforeReplace: true },
  ),
  new gcp.serviceaccount.IAMMember(
    `iam-service-token-${repo}`,
    {
      serviceAccountId: serviceServiceAccount.name,
      role: 'roles/iam.serviceAccountTokenCreator',
      member: pulumi.interpolate`principalSet://iam.googleapis.com/${identityPool.name}/attribute.repository/${owner}/${repo}`,
    },
    { provider: gcpProvider, deleteBeforeReplace: true },
  ),
]);

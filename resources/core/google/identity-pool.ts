import * as google from '@pulumi/google-native';
import { nativeProvider } from './provider';

const identityPool = new google.iam.v1.WorkloadIdentityPool(
  'github',
  {
    disabled: false,
    workloadIdentityPoolId: 'github',
  },
  { provider: nativeProvider },
);

export const identityPoolProvider = new google.iam.v1.Provider(
  'github-actions',
  {
    workloadIdentityPoolId: identityPool.id,
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
  { provider: nativeProvider },
);

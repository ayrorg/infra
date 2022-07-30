import * as google from '@pulumi/google-native';
import { project } from './project';
import { nativeProvider } from './provider';

const identityPool = new google.iam.v1.WorkloadIdentityPool(
  'github',
  {
    disabled: false,
    location: 'global',
    workloadIdentityPoolId: 'github',
  },
  { provider: nativeProvider },
);

export const identityPoolProvider = new google.iam.v1.Provider(
  'github',
  {
    workloadIdentityPoolId: identityPool.id,
    workloadIdentityPoolProviderId: 'github',
    location: 'global',
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

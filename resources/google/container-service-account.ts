import * as gcp from '@pulumi/gcp';
import { provider } from './project';

export const serviceAccount = new gcp.serviceaccount.Account(
  'container-service-account',
  {
    accountId: 'container',
  },
  { provider: provider.gcp },
);

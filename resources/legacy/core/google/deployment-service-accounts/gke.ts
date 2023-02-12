import * as gcp from '@pulumi/gcp';
import { provider } from '../provider';

export const serviceAccount = new gcp.serviceaccount.Account(
  'gke-service-account',
  {
    accountId: 'kubernetes-eng',
  },
  { provider },
);


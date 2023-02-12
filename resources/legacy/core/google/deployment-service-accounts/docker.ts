import * as gcp from '@pulumi/gcp';
import { provider } from '../provider';

export const serviceAccount = new gcp.serviceaccount.Account(
  'docker-service-account',
  {
    accountId: 'docker',
  },
  { provider },
);


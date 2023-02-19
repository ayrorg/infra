import * as google from '@pulumi/google-native';
import { provider } from '../../google/providers';
import { name } from './config';

export const serviceAccount = new google.iam.v1.ServiceAccount(
  name,
  {
    accountId: name,
  },
  {
    provider: provider.google,
    deleteBeforeReplace: true,
  },
);

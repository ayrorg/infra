import * as google from '@pulumi/google-native';
import { project } from '../../config';
import { name } from './config';

export const serviceAccount = new google.iam.v1.ServiceAccount(
  name,
  {
    accountId: name,
    project,
  },
  {
    deleteBeforeReplace: true,
  },
);

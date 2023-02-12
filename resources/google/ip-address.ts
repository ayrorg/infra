import * as google from '@pulumi/google-native';
import { region } from '../config';

export const address = new google.compute.v1.Address('ayr-core-address', {
  name: 'ayr-core-address',
  addressType: 'EXTERNAL',
  region,
});

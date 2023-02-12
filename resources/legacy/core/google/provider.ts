import * as gcp from '@pulumi/gcp';
import * as google from '@pulumi/google-native';
import { region, zone } from '../config';
import { project } from './project';

export const provider = new gcp.Provider('core-google', {
  project: project.projectId,
});

export const nativeProvider = new google.Provider('core-google', {
  project: project.projectId,
  region,
  zone,
});

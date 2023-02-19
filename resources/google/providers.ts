import * as gcp from '@pulumi/gcp';
import * as google from '@pulumi/google-native';
import { region, zone } from '../config';
import { project, apiServices } from './project';

export const provider = {
  gcp: new gcp.Provider(
    'main-gcp',
    {
      project: project.projectId,
    },
    { dependsOn: apiServices },
  ),
  google: new google.Provider(
    'main-google',
    {
      project: project.projectId,
      region,
      zone,
    },
    { dependsOn: apiServices },
  ),
};

export const providers = [provider.gcp, provider.google];

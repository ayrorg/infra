import * as gcp from '@pulumi/gcp';
import { provider } from './provider';
import { project } from './project';
import { appEngineLocation } from '../config';

export const appEngine = new gcp.appengine.Application(
  'onboarding',
  {
    locationId: appEngineLocation,
  },
  { provider, dependsOn: project },
);

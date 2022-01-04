import * as gcp from '@pulumi/gcp';
import { provider } from './provider';
import { project } from './project';
import { apiServices } from '../../google/api-services';
import { apiServices as localApiServices } from './api-services';
import { appEngineLocation } from '../config';

export const appEngine = new gcp.appengine.Application(
  'core',
  {
    locationId: appEngineLocation,
  },
  { provider, dependsOn: [project, ...apiServices, ...localApiServices] },
);

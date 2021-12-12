import * as gcp from '@pulumi/gcp';
import { appEngineLocation } from '../config';

export const appEngine = new gcp.appengine.Application('onboarding', {
  locationId: appEngineLocation,
});

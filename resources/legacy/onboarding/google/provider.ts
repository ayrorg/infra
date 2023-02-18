import * as gcp from '@pulumi/gcp';
import { project } from './project';

export const provider = new gcp.Provider('onboarding-google', {
  project: project.projectId,
});

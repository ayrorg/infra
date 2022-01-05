import * as gcp from '@pulumi/gcp';
import { project } from './project';

export const provider = new gcp.Provider('core-google', {
  project: project.projectId,
});

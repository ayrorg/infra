import * as gcp from '@pulumi/gcp';
import { websiteProject } from './project';

export const provider = new gcp.Provider('website-google', {
  project: websiteProject.projectId,
}, { dependsOn: websiteProject });

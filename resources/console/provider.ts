import * as gcp from '@pulumi/gcp';
import { project } from './config';

export const provider = new gcp.Provider('console-google', {
  project,
});

import * as gcp from '@pulumi/gcp';
import { serviceAccountKey } from './reseller-service-account';
import { project } from '../config';
import { projectIamPolicy } from './iam';

export const provider = new gcp.Provider(
  'reseller-gcp-provider',
  {
    credentials: serviceAccountKey.privateKey.apply((key) =>
      Buffer.from(key, 'base64').toString('utf-8'),
    ),
    project,
  },
  { dependsOn: projectIamPolicy },
);

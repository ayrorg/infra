import * as gcp from '@pulumi/gcp';
import * as pulumi from '@pulumi/pulumi';
import { serviceAccountKey } from './reseller-service-account';
import { project } from '../config';
import { projectIamPolicy } from './iam';

export const provider = new gcp.Provider(
  'reseller-gcp-provider',
  {
    credentials: pulumi.secret(serviceAccountKey.privateKey.apply((key) =>
      Buffer.from(key, 'base64').toString('utf-8'),
    )),
    project,
  },
  { dependsOn: projectIamPolicy },
);

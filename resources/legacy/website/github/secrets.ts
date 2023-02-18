import * as github from '@pulumi/github';
import { mainRepo, studioRepo } from '../config';
// import { callbackFunction } from '../google/deploy-url';
import { provider } from '../../github/provider';
import { serviceAccountKey } from '../google/frontend-service-account';
import { project } from '../../google/config';

// new github.ActionsSecret(
//   'deploy-url',
//   {
//     secretName: 'DEPLOYMENT_URL',
//     plaintextValue: callbackFunction.function.httpsTriggerUrl,
//     repository: studioRepo,
//   },
//   { provider },
// );

[mainRepo, studioRepo].map((repository) => [
  new github.ActionsSecret(
    `${repository}-gcp-key`,
    {
      secretName: 'GOOGLE_PROJECT_SA_KEY',
      // plaintextValue: pulumi
      //   .output(serviceAccountKey.privateKeyData)
      //   .apply((k) => Buffer.from(k, 'base64').toString('utf-8')),
      plaintextValue: serviceAccountKey.privateKey,
      repository,
    },
    { provider },
  ),
  new github.ActionsSecret(
    `${repository}-project-id`,
    {
      secretName: 'GOOGLE_PROJECT_ID',
      plaintextValue: project,
      repository,
    },
    { provider },
  ),
]);

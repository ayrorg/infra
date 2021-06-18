import * as github from '@pulumi/github';
import { repos } from './config';
import { callbackFunction } from '../website/deploy-url';
import { provider } from './provider';
import { serviceAccountKey } from '../google/frontend-service-account';
import { project } from '../google/config';

new github.ActionsSecret(
  'deploy-url',
  {
    secretName: 'DEPLOYMENT_URL',
    plaintextValue: callbackFunction.function.httpsTriggerUrl,
    repository: 'studio',
  },
  { provider },
);

repos.map((repository) => [
  new github.ActionsSecret(
    `${repository}-gcp-key`,
    {
      secretName: 'GOOGLE_PROJECT_SA_KEY',
      plaintextValue: serviceAccountKey.privateKeyData.apply((k) =>
        Buffer.from(k, 'base64').toString('utf-8'),
      ),
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

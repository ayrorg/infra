import * as github from '@pulumi/github';
import { provider } from '../../github/provider';
import { consoleProject } from '../google/project';
import { serviceAccountKey } from '../google/deploy-service-account';

const repositories = ['google-workspace-runner', 'consumer-api'];

export const secrets = repositories.map((repository) => [
  new github.ActionsSecret(
    `${repository}-gcp-project`,
    {
      repository,
      secretName: 'GOOGLE_PROJECT_ID',
      plaintextValue: consoleProject.projectId,
    },
    { provider, deleteBeforeReplace: true },
  ),
  new github.ActionsSecret(
    `${repository}-gcp-sa-key`,
    {
      repository,
      secretName: 'GOOGLE_PROJECT_SA_KEY',
      plaintextValue: serviceAccountKey.privateKey,
    },
    { provider, deleteBeforeReplace: true },
  ),
]);

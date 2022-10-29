import * as github from '@pulumi/github';
import { provider } from '../../github/provider';
import { serviceAccount as dockerServiceAccount } from '../google/deployment-service-accounts/docker';
import { identityPoolProvider } from '../google/identity-pool';
import { infraRepositories } from '../config';
import { project } from '../google/project';

infraRepositories.map((repo) => [
  new github.ActionsSecret(
    `${repo}-core-gke-project-id`,
    {
      repository: repo,
      secretName: 'GOOGLE_PROJECT_ID',
      plaintextValue: project.projectId,
    },
    { provider, deleteBeforeReplace: true },
  ),
  new github.ActionsSecret(
    `${repo}-core-gke-docker-service-account`,
    {
      repository: repo,
      secretName: 'SERVICE_ACCOUNT_EMAIL',
      plaintextValue: dockerServiceAccount.email,
    },
    { provider, deleteBeforeReplace: true },
  ),
  new github.ActionsSecret(
    `${repo}-core-gke-identity-provider`,
    {
      repository: repo,
      secretName: 'WORKLOAD_IDENTITY_PROVIDER',
      plaintextValue: identityPoolProvider.name,
    },
    { provider, deleteBeforeReplace: true },
  ),
]);

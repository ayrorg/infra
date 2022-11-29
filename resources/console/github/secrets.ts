import * as github from '@pulumi/github';
import { provider } from '../../github/provider';
import { dockerRepo } from '../google/artifacts';
import { serviceAccountKey } from '../google/deploy-service-account';
import { interpolate } from '@pulumi/pulumi';
import { microserviceRepositories } from '../config';
import { consoleProject } from '../google/project';
import { serviceAccount as microserviceServiceAccount } from '../google/deployment-service-accounts/service';
import { identityPoolProvider } from '../google/identity-pool';

const repositories = [
  'workspace-agent',
  'consumer-api',
  'tripletex-agent',
  'dyreparken-calendar-integration',
];

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

microserviceRepositories.map((repo) => [
  new github.ActionsSecret(
    `${repo}-main-repo`,
    {
      repository: repo,
      secretName: 'DOCKER_REPOSITORY',
      plaintextValue: interpolate`${dockerRepo.location}-docker.pkg.dev/${consoleProject.projectId}/${dockerRepo.repositoryId}`,
    },
    { provider, deleteBeforeReplace: true },
  ),
  new github.ActionsSecret(
    `${repo}-service-service-account`,
    {
      repository: repo,
      secretName: 'SERVICE_ACCOUNT_EMAIL',
      plaintextValue: microserviceServiceAccount.email,
    },
    { provider, deleteBeforeReplace: true },
  ),
  new github.ActionsSecret(
    `${repo}-identity-provider`,
    {
      repository: repo,
      secretName: 'WORKLOAD_IDENTITY_PROVIDER',
      plaintextValue: identityPoolProvider.name,
    },
    { provider, deleteBeforeReplace: true },
  ),
]);

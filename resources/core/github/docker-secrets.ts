import * as github from '@pulumi/github';
import { provider } from '../../github/provider';
import { dockerRepo } from '../google/artifacts';
import { interpolate } from '@pulumi/pulumi';
import { serviceAccount as dockerServiceAccount } from '../google/deployment-service-accounts/docker';
import { identityPoolProvider } from '../google/identity-pool';
import { repositoriesWithDocker } from '../config';
import { project } from '../google/project';

repositoriesWithDocker.map((repo) => [
  new github.ActionsSecret(
    `${repo}-core-project-id`,
    {
      repository: repo,
      secretName: 'GOOGLE_PROJECT_ID',
      plaintextValue: project.projectId,
    },
    { provider, deleteBeforeReplace: true },
  ),
  new github.ActionsSecret(
    `${repo}-core-docker-repo`,
    {
      repository: repo,
      secretName: 'DOCKER_REPOSITORY',
      plaintextValue: interpolate`${dockerRepo.location}-docker.pkg.dev/${project.projectId}/${dockerRepo.repositoryId}`,
    },
    { provider, deleteBeforeReplace: true },
  ),
  new github.ActionsSecret(
    `${repo}-core-docker-service-account`,
    {
      repository: repo,
      secretName: 'SERVICE_ACCOUNT_EMAIL',
      plaintextValue: dockerServiceAccount.email,
    },
    { provider, deleteBeforeReplace: true },
  ),
  new github.ActionsSecret(
    `${repo}-core-identity-provider`,
    {
      repository: repo,
      secretName: 'WORKLOAD_IDENTITY_PROVIDER',
      plaintextValue: identityPoolProvider.name,
    },
    { provider, deleteBeforeReplace: true },
  ),
  new github.ActionsSecret(
    `${repo}-core-docker-registry`,
    {
      repository: repo,
      secretName: 'DOCKER_REGISTRY',
      plaintextValue: interpolate`${dockerRepo.location}-docker.pkg.dev`,
    },
    { provider, deleteBeforeReplace: true },
  ),
]);
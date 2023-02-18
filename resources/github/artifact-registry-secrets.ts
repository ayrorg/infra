import * as github from '@pulumi/github';
import { provider } from '../github/provider';
import { repository as artifactRepository } from '../google/artifact-registry';
import { interpolate } from '@pulumi/pulumi';
import { identityPoolProvider } from '../google/identity-pool';
import { repositoriesWithContainers } from '../config';
import { project } from '../google/project';
import { artifactRepoUrl } from '../google/artifact-registry';
import { serviceAccount } from '../google/container-service-account';

repositoriesWithContainers.map((repo) => [
  new github.ActionsSecret(
    `${repo}-main-project-id`,
    {
      repository: repo,
      secretName: 'GOOGLE_PROJECT_ID',
      plaintextValue: project.projectId,
    },
    { provider, deleteBeforeReplace: true },
  ),
  new github.ActionsSecret(
    `${repo}-main-artifact-repo`,
    {
      repository: repo,
      secretName: 'ARTIFACT_REPOSITORY',
      plaintextValue: artifactRepoUrl,
    },
    { provider, deleteBeforeReplace: true },
  ),
  new github.ActionsSecret(
    `${repo}-main-service-account`,
    {
      repository: repo,
      secretName: 'SERVICE_ACCOUNT_EMAIL',
      plaintextValue: serviceAccount.email,
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
    `${repo}-core-artifact-registry`,
    {
      repository: repo,
      secretName: 'ARTIFACT_HOST',
      plaintextValue: interpolate`${artifactRepository.location}-docker.pkg.dev`,
    },
    { provider, deleteBeforeReplace: true },
  ),
]);

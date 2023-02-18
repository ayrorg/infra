import * as gcp from '@pulumi/gcp';
import { interpolate } from '@pulumi/pulumi';
import { developers, region } from '../config';
import { serviceAccount } from './container-service-account';
import { provider } from './project';
import { project } from './project';

export const repository = new gcp.artifactregistry.Repository(
  'main-artifact-registry',
  {
    repositoryId: project.projectId,
    location: region,
    format: 'DOCKER',
  },
  { provider: provider.gcp },
);

new gcp.artifactregistry.RepositoryIamMember(
  'main-artifact-registry',
  {
    repository: repository.id,
    member: interpolate`serviceAccount:${serviceAccount.email}`,
    role: 'roles/artifactregistry.writer',
  },
  { provider: provider.gcp },
);

developers.map(
  (developer) =>
    new gcp.artifactregistry.RepositoryIamMember(
      `main-artifact-iam-${developer}`,
      {
        repository: repository.id,
        member: interpolate`user:${developer}`,
        role: 'roles/artifactregistry.writer',
      },
      { provider: provider.gcp, deleteBeforeReplace: true },
    ),
);

export const artifactRepoUrl = interpolate`${repository.location}-docker.pkg.dev/${project.name}/${repository.repositoryId}`;

import * as gcp from '@pulumi/gcp';
import { interpolate } from '@pulumi/pulumi';
import { developers } from '../config';
import { project, region } from './config';
import { provider } from './provider';
import { apiServices } from './api-services';
import { serviceAccount as dockerServiceAccount } from './deployment-service-accounts/docker';

export const dockerRepo = new gcp.artifactregistry.Repository(
  'core-docker-registry',
  {
    repositoryId: project,
    location: region,
    format: 'DOCKER',
  },
  { provider, dependsOn: apiServices },
);

export const artifactRepoUrl = interpolate`${dockerRepo.location}-docker.pkg.dev/${project}/${dockerRepo.repositoryId}`;

new gcp.artifactregistry.RepositoryIamMember(
  'core-docker-registry',
  {
    repository: dockerRepo.id,
    member: interpolate`serviceAccount:${dockerServiceAccount.email}`,
    role: 'roles/artifactregistry.writer',
  },
  { provider, dependsOn: apiServices },
);

developers.map(
  (developer) =>
    new gcp.artifactregistry.RepositoryIamMember(
      `core-docker-registry-${developer}`,
      {
        repository: dockerRepo.id,
        member: interpolate`user:${developer}`,
        role: 'roles/artifactregistry.writer',
      },
      { provider, dependsOn: apiServices, deleteBeforeReplace: true },
    ),
);

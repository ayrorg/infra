import * as gcp from '@pulumi/gcp';
import { interpolate } from '@pulumi/pulumi';
import { developers, project, region } from '../config';
import { provider } from './provider';
import { apiServices } from './api-services';
import { serviceAccount as serviceServiceAccount } from './deployment-service-accounts/service';

export const dockerRepo = new gcp.artifactregistry.Repository(
  'docker-registry',
  {
    repositoryId: project,
    location: region,
    format: 'DOCKER',
  },
  { provider, dependsOn: apiServices },
);

new gcp.artifactregistry.RepositoryIamMember(
  'docker-registry',
  {
    repository: dockerRepo.id,
    member: interpolate`serviceAccount:${serviceServiceAccount.email}`,
    role: 'roles/artifactregistry.writer',
  },
  { provider, dependsOn: apiServices },
);

developers.map(
  (developer) =>
    new gcp.artifactregistry.RepositoryIamMember(
      `docker-registry-${developer}`,
      {
        repository: dockerRepo.id,
        member: interpolate`user:${developer}`,
        role: 'roles/artifactregistry.writer',
      },
      { provider, dependsOn: apiServices, deleteBeforeReplace: true },
    ),
);

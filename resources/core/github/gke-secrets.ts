import * as github from '@pulumi/github';
import { provider } from '../../github/provider';
import { serviceAccount as gkeServiceAccount } from '../google/deployment-service-accounts/gke';
import { identityPoolProvider } from '../google/identity-pool';
import { infraRepositories } from '../config';
import { project } from '../google/project';
// import { cluster } from '../google/gke';

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
      plaintextValue: gkeServiceAccount.email,
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
  // new github.ActionsSecret(
  //   `${repo}-core-gke-cluster-name`,
  //   {
  //     repository: repo,
  //     secretName: 'CLUSTER_NAME',
  //     plaintextValue: cluster.name,
  //   },
  //   { provider, deleteBeforeReplace: true },
  // ),
  // new github.ActionsSecret(
  //   `${repo}-core-gke-cluster-location`,
  //   {
  //     repository: repo,
  //     secretName: 'CLUSTER_LOCATION',
  //     plaintextValue: cluster.location,
  //   },
  //   { provider, deleteBeforeReplace: true },
  // ),
]);

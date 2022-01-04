import * as github from '@pulumi/github';
import { provider } from '../../github/provider';
import { project } from '../google/project';
import { serviceAccountKey } from '../google/deploy-service-account';
import { repository } from '../config';

export const githubGcpSaProject = new github.ActionsSecret(
  `core-gcp-project`,
  {
    repository,
    secretName: 'GOOGLE_PROJECT_ID',
    plaintextValue: project.projectId,
  },
  { provider, deleteBeforeReplace: true },
);

export const githubGcpSaKey = new github.ActionsSecret(
  `core-gcp-sa-key`,
  {
    repository,
    secretName: 'GOOGLE_PROJECT_SA_KEY',
    plaintextValue: serviceAccountKey.privateKey,
  },
  { provider, deleteBeforeReplace: true },
);

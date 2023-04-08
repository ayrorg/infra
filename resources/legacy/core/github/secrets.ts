import * as github from '@pulumi/github';
import { provider } from '../../github/provider';
import { project } from '../google/project';
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

export const githubBackofficeGcpSaProject = new github.ActionsSecret(
  `core-backoffice-gcp-project`,
  {
    repository: 'backoffice',
    secretName: 'GOOGLE_PROJECT_ID',
    plaintextValue: project.projectId,
  },
  { provider, deleteBeforeReplace: true },
);

import * as github from '@pulumi/github';
import { provider } from '../../github/provider';
import { project } from '../google/project';
import { repository } from '../config';

export const githubGcpSaProject = new github.ActionsSecret(
  `onboarding-gcp-project`,
  {
    repository,
    secretName: 'GOOGLE_PROJECT_ID',
    plaintextValue: project.projectId,
  },
  { provider, deleteBeforeReplace: true },
);

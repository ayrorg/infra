import * as github from '@pulumi/github';
import { mainRepo, studioRepo } from '../config';
import { provider } from '../../github/provider';
import { project } from '../../google/config';

[mainRepo, studioRepo].map((repository) => [
  new github.ActionsSecret(
    `${repository}-project-id`,
    {
      secretName: 'GOOGLE_PROJECT_ID',
      plaintextValue: project,
      repository,
    },
    { provider },
  ),
]);

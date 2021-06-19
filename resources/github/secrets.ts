import * as github from '@pulumi/github';
import { token } from './config';
import { provider } from './provider';

new github.ActionsOrganizationSecret(
  'ayrbot-token',
  {
    secretName: 'AYRBOT_GITHUB_TOKEN',
    plaintextValue: token,
    visibility: 'all',
  },
  { provider },
);

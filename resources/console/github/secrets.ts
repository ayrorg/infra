import * as github from '@pulumi/github';
import { provider } from '../../github/provider';
import { consoleProject } from '../google/project';
import { serviceAccountKey } from '../google/deploy-service-account';

const repository = 'google-workspace-runner';

new github.ActionsSecret(
  `${repository}-gcp-sa-key`,
  {
    repository,
    secretName: 'GOOGLE_PROJECT_SA_KEY',
    plaintextValue: serviceAccountKey.privateKeyData,
  },
  { provider },
);

new github.ActionsSecret(
  `${repository}-gcp-project`,
  {
    repository,
    secretName: 'GOOGLE_PROJECT_ID',
    plaintextValue: consoleProject.projectId,
  },
  { provider },
);

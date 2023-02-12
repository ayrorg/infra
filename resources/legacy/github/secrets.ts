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

const serviceRepos = github.getRepositories({
  query: 'org:ayrorg is:private',
});

serviceRepos.then((repos) =>
  repos.names.map(
    (repository) =>
      new github.ActionsSecret(
        `${repository}-ayrbot-token`,
        {
          repository,
          secretName: 'AYRBOT_GITHUB_TOKEN',
          plaintextValue: token,
        },
        { provider },
      ),
  ),
);

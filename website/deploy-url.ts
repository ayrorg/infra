import * as gcp from '@pulumi/gcp';
import { Octokit } from '@octokit/rest';

export const callbackFunction = new gcp.cloudfunctions.HttpCallbackFunction(
  'github-deploy',
  {
    environmentVariables: {
      GITHUB_TOKEN: process.env.GITHUB_TOKEN || '',
    },
    region: 'europe-west2',
    async callback(req) {
      const octokit = new Octokit({
        auth: process.env.GITHUB_TOKEN,
      });

      const repoDetails = {
        owner: 'basssene',
        repo: 'website',
      };

      type PossibleEnvs = 'dev' | 'prod';
      const env = (req.query.environment as undefined | PossibleEnvs) || 'dev';

      let ref = 'main';

      if (env === 'prod') {
        const {
          data: { tag_name },
        } = await octokit.repos.getLatestRelease(repoDetails);
        ref = tag_name;
      }

      await octokit.actions.createWorkflowDispatch({
        ...repoDetails,
        workflow_id: env === 'dev' ? 'dispatch-dev.yml' : 'dispatch-prod.yml',
        ref,
      });

      return true;
    },
  },
);

export const deploymentUrl = callbackFunction.function.httpsTriggerUrl;

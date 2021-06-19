import * as gcp from '@pulumi/gcp';
import { Octokit } from '@octokit/rest';
import { token, owner } from '../../github/config';
import { mainRepo } from '../config';
import { cloudFunctionRegion } from '../../google/config';
import { websiteProject } from './project';

export const callbackFunction = new gcp.cloudfunctions.HttpCallbackFunction(
  'github-deploy',
  {
    environmentVariables: {
      GITHUB_TOKEN: token,
      GITHUB_OWNER: owner,
      GITHUB_REPO: mainRepo,
    },
    region: cloudFunctionRegion,
    runtime: 'nodejs14',
    project: websiteProject.projectID,
    async callback(req) {
      const octokit = new Octokit({
        auth: process.env.GITHUB_TOKEN,
      });

      const repoDetails = {
        owner: process.env.GITHUB_OWNER || '',
        repo: process.env.GITHUB_REPO || '',
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
  { dependsOn: websiteProject },
);

export const deploymentUrl = callbackFunction.function.httpsTriggerUrl;

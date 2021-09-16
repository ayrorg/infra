// import * as gcp from '@pulumi/gcp';
// import { Octokit } from '@octokit/rest';
// import { token, owner } from '../../github/config';
// import { mainRepo } from '../config';
// import { cloudFunctionRegion } from '../../google/config';
// import { websiteProject } from './project';
// import { provider } from './provider';

// export const callbackFunction = new gcp.cloudfunctions.HttpCallbackFunction(
//   'deploy-to-github-func',
//   {
//     environmentVariables: {
//       GITHUB_TOKEN: token,
//       GITHUB_OWNER: owner,
//       GITHUB_REPO: mainRepo,
//     },
//     region: cloudFunctionRegion,
//     runtime: 'nodejs14',
//     project: websiteProject.projectID,
//     async callback(req) {
//       const octokit = new Octokit({
//         auth: process.env.GITHUB_TOKEN,
//       });

//       const repoDetails = {
//         owner: process.env.GITHUB_OWNER || '',
//         repo: process.env.GITHUB_REPO || '',
//       };

//       if (req.query.environment === 'prod') {
//         const latestRelease = await octokit.repos.getLatestRelease(repoDetails);
//         await octokit.actions.createWorkflowDispatch({
//           ...repoDetails,
//           workflow_id: 'dispatch-prod.yml',
//           ref: latestRelease.data.tag_name,
//         });
//       } else if (req.query.environment === 'dev') {
//         await octokit.actions.createWorkflowDispatch({
//           ...repoDetails,
//           workflow_id: 'dispatch-prod.yml',
//           ref: 'main',
//         });
//       }

//       return true;
//     },
//   },
//   { dependsOn: websiteProject, provider, },
// );

// export const deploymentUrl = callbackFunction.function.httpsTriggerUrl;

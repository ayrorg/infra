import * as pulumi from '@pulumi/pulumi';

const config = new pulumi.Config();

export const developers = config.requireObject<string[]>('developers');

export const repositoriesWithContainers = config.requireObject<string[]>(
  'repositories-with-containers',
);

export const systemEmail = config.require('system-email');

/**
 * Google Cloud Platform configuration
 */

const googleConfig = new pulumi.Config('google');

export const projectName = googleConfig.require('project');
export const billingAccount = googleConfig.require('billing-account');
export const organizationId = googleConfig.require('organization-id');
export const region = googleConfig.require('region');
export const zone = googleConfig.require('zone');

/**
 * GitHub configuration
 */

const gitHubConfig = new pulumi.Config('github');

export const github = {
  owner: gitHubConfig.require('owner'),
  token: gitHubConfig.requireSecret('token'),
}

import * as pulumi from '@pulumi/pulumi';

const config = new pulumi.Config('core');

export const projectName = config.require('project');
export const repository = config.require('repo');
export const developers = config.requireObject<string[]>('developers');
export const sqlUsers = config.requireObject<string[]>('sql-users');
export const appEngineLocation = 'europe-central2';

export const region = config.require('region');
export const zone = config.require('zone');

export const repositoriesWithDocker = config.requireObject<string[]>(
  'repositories-with-docker',
);

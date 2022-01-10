import * as pulumi from '@pulumi/pulumi';

const config = new pulumi.Config('core');

export const projectName = config.require('project');
export const repository = config.require('repo');
export const viewerUsers = config.requireObject<string[]>('viewer-users');
export const sqlUsers = config.requireObject<string[]>('sql-users');
export const appEngineLocation = 'europe-central2';

import * as pulumi from '@pulumi/pulumi';

const config = new pulumi.Config('onboarding');

export const project = config.require('project');
export const repository = config.require('repo');
export const viewerUsers = config.requireObject<string[]>('viewer-users');
export const appEngineLocation = 'europe-central2';

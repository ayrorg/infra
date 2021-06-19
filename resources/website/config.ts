import * as pulumi from '@pulumi/pulumi';

const config = new pulumi.Config('website');

export const project = config.require('project');
export const mainRepo = config.require('main-repo');
export const studioRepo = config.require('studio-repo');

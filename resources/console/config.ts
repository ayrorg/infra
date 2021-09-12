import * as pulumi from '@pulumi/pulumi';

const config = new pulumi.Config('console');

export const project = config.require('project');
export const viewerUsers = config.requireObject<string[]>('viewer-users');

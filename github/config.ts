import * as pulumi from '@pulumi/pulumi';

const config = new pulumi.Config('github');

export const owner = config.require('owner');
export const token = config.requireSecret('token');
export const repos = config.requireObject<string[]>('repos');

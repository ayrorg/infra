import * as pulumi from '@pulumi/pulumi';

const config = new pulumi.Config('workspace-runner');

export const tag = config.require('tag');
export const imageName = config.require('image-name');
export const location = config.get('location') ?? 'europe-west1';

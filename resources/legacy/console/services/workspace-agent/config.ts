import * as pulumi from '@pulumi/pulumi';

const config = new pulumi.Config('workspace-agent');

export const name = 'workspace-agent';
export const tag = config.require('tag');
export const imageName = config.require('image-name');
export const location = config.get('location') ?? 'europe-west1';
export const resellerTopicId = config.require('reseller-topic-id');

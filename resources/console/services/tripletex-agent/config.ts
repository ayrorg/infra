import * as pulumi from '@pulumi/pulumi';

const config = new pulumi.Config('tripletex-agent');

export const name = 'tripletex-agent';
export const tag = config.require('tag');
export const imageName = config.get('image-name') ?? name;
export const location = config.get('location') ?? 'europe-north1';
export const domain = config.get('domain') ?? 'tripletex-agent.v1.ayr.no';

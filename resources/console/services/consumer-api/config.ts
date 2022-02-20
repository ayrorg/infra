import * as pulumi from '@pulumi/pulumi';

const config = new pulumi.Config('consumer-api');

export const name = 'consumer-api';
export const tag = config.require('tag');
export const imageName = config.get('image-name') ?? name;
export const location = config.get('location') ?? 'europe-north1';
export const domain = config.get('domain') ?? 'consumer-api.v1.ayr.no';

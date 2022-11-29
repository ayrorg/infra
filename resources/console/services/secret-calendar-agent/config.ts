import * as pulumi from '@pulumi/pulumi';

const config = new pulumi.Config('secret-calendar-agent');

export const name = 'secret-calendar-agent';
export const tag = config.require('tag');
export const imageName = config.get('image-name') ?? name;
export const location = config.get('location') ?? 'europe-north1';
export const domain = config.get('domain') ?? 'api.v1.ayr.no';

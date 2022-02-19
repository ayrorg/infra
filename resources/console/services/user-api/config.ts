import * as pulumi from '@pulumi/pulumi';

const config = new pulumi.Config('user-api');

export const name = 'user-api';
export const tag = config.require('tag');
export const imageName = config.get('image-name') ?? name;
export const location = config.get('location') ?? 'europe-west1';

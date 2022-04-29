import * as pulumi from '@pulumi/pulumi';

const config = new pulumi.Config('console');

export const project = config.require('project');
export const viewerUsers = config.requireObject<string[]>('viewer-users');
export const location = config.get('location') ?? 'europe-west1';
export const region = config.get('location') ?? 'europe-west1';
export const developers = ['so@bjerk.io'];
export const posthogApiKey = config.require('posthog-api-key');
export const posthogHost = config.require('posthog-host');

export const microserviceRepositories = ['freshworks-agent'];

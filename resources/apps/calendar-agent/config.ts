import * as pulumi from '@pulumi/pulumi';

const config = new pulumi.Config('calendar-agent');

export const name = 'calendar-agent';
export const tag = config.require('tag');
export const selfUrl = config.require('self-url');
export const location = config.get('location') ?? 'europe-north1';
export const domain = config.get('domain') ?? 'calendar-agent.v1.ayr.no';

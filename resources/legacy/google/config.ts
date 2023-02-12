import * as pulumi from '@pulumi/pulumi';

const config = new pulumi.Config('google-legacy');

export const project = config.require('project');
export const region = config.require('region');
export const cloudFunctionRegion = config.require('cloud-function-region');
export const billingAccount = config.require('billing-account');
export const organizationId = config.require('organization-id');

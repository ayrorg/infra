import * as pulumi from '@pulumi/pulumi';

const config = new pulumi.Config('tripletex');

export const employeeToken = config.requireSecret('employee-token');
export const consumerToken = config.requireSecret('consumer-token');

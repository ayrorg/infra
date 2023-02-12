import { Config } from '@pulumi/pulumi';

const config = new Config();

export const deployServiceAccountEmail = config.require(
  'deploy-service-account',
);

import { Config } from '@pulumi/pulumi';

const config = new Config();

export const deployServiceAccountEmail = config.require(
  'deploy-service-account',
);
export const repositoriesWithDocker = config.requireObject<string[]>(
  'repositories-with-docker',
);
export const developers = config.requireObject<string[]>('developers');

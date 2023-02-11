import { project, viewerUsers } from '../../config';
import { serviceAccount } from './service-account';
import { CloudRunService } from '../../../../components/cloudrun-service';
import { Config } from '@pulumi/pulumi';

const config = new Config('workspace-agent-v2');

export const service = new CloudRunService('workspace-agent-v2', {
  imageName: config.require('image-name'),
  tag: config.require('tag'),
  project,
  location: config.get('location') ?? 'europe-west1',
  serviceAccount,
  invokerUsers: viewerUsers,
  registryUrl: 'europe-north1-docker.pkg.dev/ayr-console/ayr-console',
  envs: [
    {
      name: 'SELF_URL',
      value: 'http://127.0.0.1',
    }
  ]
});

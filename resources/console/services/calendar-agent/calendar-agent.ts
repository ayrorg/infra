import * as config from './config';
import * as gcp from '@pulumi/gcp';
import { project, viewerUsers } from '../../config';
import { provider } from '../../google/provider';
import { serviceAccount } from './service-account';
import { CloudRunService } from '../../../../components/cloudrun-service';

export const service = new CloudRunService(config.name, {
  imageName: config.imageName,
  tag: config.tag,
  project,
  location: config.location,
  serviceAccount,
  invokerUsers: viewerUsers,
  envs: [
    {
      name: 'SELF_URL',
      value: 'https://calendar-agent-d3093ec-47jlpbhffa-lz.a.run.app',
    },
  ],
});

export const domainMapping = new gcp.cloudrun.DomainMapping(
  config.name,
  {
    location: config.location,
    name: config.domain,
    metadata: { namespace: project },
    spec: {
      routeName: service.service.name,
    },
  },
  { provider },
);

// export const domainMapping = new google.run.v1.DomainMapping(config.name, {
//   project,
//   location: config.location,
//   kind: 'DomainMapping',
//   apiVersion: 'domains.cloudrun.com/v1',
//   metadata: { name: config.domain },
//   spec: { routeName: service.service.name },
// });

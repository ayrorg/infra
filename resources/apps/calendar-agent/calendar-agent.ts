import * as config from './config';
import * as gcp from '@pulumi/gcp';
import { developers } from '../../config';
import { providers, project, provider } from '../../google/project';
import { serviceAccount } from './service-account';
import { CloudRunService } from '../../components/cloudrun-service';

export const service = new CloudRunService(
  config.name,
  {
    imageName: config.imageName,
    tag: config.tag,
    project: project.name,
    location: config.location,
    serviceAccount,
    invokerUsers: developers,
    envs: [
      {
        name: 'SELF_URL',
        value: 'https://calendar-agent-d3093ec-47jlpbhffa-lz.a.run.app',
      },
    ],
  },
  { providers },
);

export const domainMapping = new gcp.cloudrun.DomainMapping(
  config.name,
  {
    location: config.location,
    name: config.domain,
    metadata: { namespace: project.name },
    spec: {
      routeName: service.service.name,
    },
  },
  { provider: provider.gcp },
);

// export const domainMapping = new google.run.v1.DomainMapping(config.name, {
//   project,
//   location: config.location,
//   kind: 'DomainMapping',
//   apiVersion: 'domains.cloudrun.com/v1',
//   metadata: { name: config.domain },
//   spec: { routeName: service.service.name },
// });

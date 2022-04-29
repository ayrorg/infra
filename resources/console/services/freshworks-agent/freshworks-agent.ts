import * as config from './config';
import { project, viewerUsers } from '../../config';
import { artifactRepoUrl } from '../../google/artifacts';
import { serviceAccount } from './service-account';
import { CloudRunService } from '../../../../components/cloudrun-service';

export const service = new CloudRunService(config.name, {
  imageName: config.imageName,
  tag: config.tag,
  project,
  location: config.location,
  registryUrl: artifactRepoUrl,
  serviceAccount,
  invokerUsers: viewerUsers,
  envs: [
    {
      name: 'FRESHDESK_API_URL',
      value: 'https://ayrno.freshdesk.com',
    },
    {
      name: 'FRESHDESK_API_TOKEN',
      value: config.freshdeskToken,
    },
  ],
});

// export const domainMapping = new google.run.v1.DomainMapping(config.name, {
//   project,
//   location: config.location,
//   kind: 'DomainMapping',
//   apiVersion: 'domains.cloudrun.com/v1',
//   metadata: { name: config.domain },
//   spec: { routeName: service.service.name },
// });

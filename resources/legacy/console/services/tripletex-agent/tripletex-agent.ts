import * as config from './config';
import * as google from '@pulumi/google-native';
import { project, viewerUsers } from '../../config';
import { serviceAccount } from './service-account';
import { CloudRunService } from '../../../../components/cloudrun-service';

export const service = new CloudRunService(config.name, {
  imageName: config.imageName,
  tag: config.tag,
  project,
  location: config.location,
  serviceAccount,
  invokerUsers: viewerUsers,
});

// export const domainMapping = new google.run.v1.DomainMapping(config.name, {
//   project,
//   location: config.location,
//   kind: 'DomainMapping',
//   apiVersion: 'domains.cloudrun.com/v1',
//   metadata: { name: config.domain },
//   spec: { routeName: service.service.name },
// });

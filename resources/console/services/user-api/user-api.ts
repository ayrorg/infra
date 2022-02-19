import * as config from './config';
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



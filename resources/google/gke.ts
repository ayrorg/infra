import * as google from '@pulumi/google-native';
import { region, zone } from '../config';
import { provider } from './providers';

const serverConfig = google.container.v1.getServerConfigOutput({
  location: region,
});

const engineVersion = serverConfig.apply((conf) => conf.validMasterVersions[0]);

export const cluster = new google.container.v1.Cluster(
  'main-cluster',
  {
    name: 'ayr-main-cluster',
    initialClusterVersion: engineVersion,
    autopilot: { enabled: true },
  },
  { provider: provider.google },
);

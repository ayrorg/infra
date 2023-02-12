import * as google from '@pulumi/google-native';
import { region, zone } from '../config';
import { provider } from './project';

const serverConfig = google.container.v1.getServerConfigOutput({
  location: region,
});

const engineVersion = serverConfig.apply((conf) => conf.validMasterVersions[0]);

const nodeConfig: google.types.input.container.v1.NodeConfigArgs = {
  machineType: 'n1-standard-2',
  oauthScopes: [
    'https://www.googleapis.com/auth/compute',
    'https://www.googleapis.com/auth/devstorage.read_only',
    'https://www.googleapis.com/auth/logging.write',
    'https://www.googleapis.com/auth/monitoring',
  ],
  preemptible: true,
};

export const cluster = new google.container.v1.Cluster(
  'main-cluster',
  {
    initialClusterVersion: engineVersion,
    nodePools: [],
  },
  { provider: provider.google },
);

const nodepool = new google.container.v1.NodePool(
  'main-nodepool',
  {
    clusterId: cluster.name,
    initialNodeCount: 1,
    management: {
      autoRepair: false,
      autoUpgrade: false,
    }
  },
  { provider: provider.google },
);

// export const nodepoolTag = nodepool.config.tags[0];
// export const taintsKey = nodepool.config.taints[0].key;

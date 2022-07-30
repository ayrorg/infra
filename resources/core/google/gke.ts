import * as google from '@pulumi/google-native';
import { nativeProvider } from './provider';

// TODO: Determine this dynamically once https://github.com/pulumi/pulumi-google-native/issues/166 is done.
const engineVersion = '1.22';

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

const cluster = new google.container.v1.Cluster(
  'core-cluster',
  {
    initialClusterVersion: engineVersion,
    nodePools: [
      {
        config: nodeConfig,
        initialNodeCount: 1,
        management: {
          autoRepair: false,
        },
        name: 'initial',
      },
    ],
  },
  { provider: nativeProvider, replaceOnChanges: ['*'] },
);

const nodepool = new google.container.v1.NodePool(
  'core-nodepool',
  {
    clusterId: cluster.name,
    initialNodeCount: 1,
    management: {
      autoRepair: false,
      autoUpgrade: false,
    },
  },
  { provider: nativeProvider },
);

export const nodepoolTag = nodepool.config.tags[0];
export const taintsKey = nodepool.config.taints[0].key;

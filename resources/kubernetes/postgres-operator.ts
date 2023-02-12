import * as k8s from '@pulumi/kubernetes';
import { provider } from './provider';

new k8s.helm.v3.Chart(
  'postgres-operator',
  {
    chart: 'postgres-operator',
    version: '1.8.2',
    fetchOpts: {
      repo: 'https://opensource.zalando.com/postgres-operator/charts/postgres-operator',
    },
  },
  { provider },
);

new k8s.helm.v3.Chart(
  'postgres-operator-ui',
  {
    chart: 'postgres-operator-ui',
    version: '1.8.2',
    fetchOpts: {
      repo: 'https://opensource.zalando.com/postgres-operator/charts/postgres-operator-ui',
    },
  },
  { provider },
);

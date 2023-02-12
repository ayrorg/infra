import * as k8s from '@pulumi/kubernetes';
import { systemEmail } from '../config';
import { provider } from './provider';
import { address } from '../google/ip-address';

const namespace = new k8s.core.v1.Namespace(
  'caddy-system',
  {
    metadata: { name: 'caddy-system' },
  },
  { provider },
);

export const ingress = new k8s.helm.v3.Chart(
  'caddy-ingress',
  {
    chart: 'caddy-ingress-controller',
    fetchOpts: {
      repo: 'https://caddyserver.github.io/ingress/',
    },
    version: 'v0.1.4',
    namespace: namespace.metadata.name,
    values: {
      ingressController: {
        config: {
          email: systemEmail,
        },
      },
      loadBalancer: {
        loadBalancerIp: address.address,
      },
    },
  },
  { provider },
);

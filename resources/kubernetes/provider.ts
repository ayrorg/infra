import * as k8s from '@pulumi/kubernetes';
import { cluster } from '../google/gke';

export const provider = new k8s.Provider('k8s-provider', {
  kubeconfig: cluster.getKubeconfig(),
});

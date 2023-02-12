import * as google from '@pulumi/google-native';
import * as k8s from '@pulumi/kubernetes';
import * as pulumi from '@pulumi/pulumi';
import { cluster } from '../google/gke';
import { project } from '../google/project';

export const kubeconfig = pulumi
  .all([cluster.name, cluster.endpoint, cluster.masterAuth, project.name])
  .apply(([name, endpoint, masterAuth, projectName]) => {
    const context = `${projectName}_${name}`;
    return `apiVersion: v1
clusters:
- cluster:
    certificate-authority-data: ${masterAuth.clusterCaCertificate}
    server: https://${endpoint}
  name: ${context}
contexts:
- context:
    cluster: ${context}
    user: ${context}
  name: ${context}
current-context: ${context}
kind: Config
preferences: {}
users:
- name: ${context}
  user:
    auth-provider:
      config:
        cmd-args: config config-helper --format=json
        cmd-path: gcloud
        expiry-key: '{.credential.token_expiry}'
        token-key: '{.credential.access_token}'
      name: gcp
`;
  });

export const provider = new k8s.Provider('k8s-provider', {
  kubeconfig,
});

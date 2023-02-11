import * as gcp from '@pulumi/gcp';
import { interpolate } from '@pulumi/pulumi';
import { provider } from '../../google/reseller-gcp-provider';
import { resellerTopicId } from './config';
import { service as workspaceAgentV1 } from './workspace-agent';
import { service as workspaceAgentV2 } from './workspace-agent-v2';

const name = 'partner-watch-workspace-agent';

new gcp.pubsub.Subscription(
  name,
  {
    topic: resellerTopicId,
    ackDeadlineSeconds: 360,
    pushConfig: {
      // oidcToken: {
      //   serviceAccountEmail: service.invokerServiceAccount.email,
      // },
      pushEndpoint: interpolate`${workspaceAgentV1.service.url}/reseller-event`,
    },
  },
  { provider },
);

new gcp.pubsub.Subscription(
  `${name}-v2`,
  {
    topic: resellerTopicId,
    ackDeadlineSeconds: 360,
    pushConfig: {
      pushEndpoint: interpolate`${workspaceAgentV2.url}/reseller-event`,
    },
  },
  { provider },
);

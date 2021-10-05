import * as gcp from '@pulumi/gcp';
import { interpolate } from '@pulumi/pulumi';
import { provider } from '../../google/reseller-gcp-provider';
import { resellerTopicId } from './config';
import { service } from './workspace-agent';

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
      pushEndpoint: interpolate`${service.url}/reseller-event`,
    },
  },
  { provider },
);

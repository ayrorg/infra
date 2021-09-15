import * as gcp from '@pulumi/gcp';
import * as pulumi from '@pulumi/pulumi';
import { provider } from './provider';
import { makePulumiCallback } from 'gcl-slack';

export const topic = new gcp.pubsub.Topic('slack-logger', {}, { provider });

const config = new pulumi.Config('slack');

topic.onMessagePublished(
  'console-new-log-entry',
  {
    region: 'europe-west1',
    runtime: 'nodejs14',
    environmentVariables: {
      WEBHOOK_URL: config.require('webhook-url'),
    },
    callback: makePulumiCallback('webhook'),
  },
  {},
  { provider },
);

const logSink = new gcp.logging.ProjectSink(
  'console-slack-logger',
  {
    name: `console-slack-logger-v1-prod`, // TODO: Make this dynamic
    filter: 'operation.producer="github.com/bjerkio/nestjs-slack@v1"',
    destination: pulumi.interpolate`pubsub.googleapis.com/${topic.id}`,
  },
  { protect: true, provider },
);

new gcp.pubsub.TopicIAMMember(
  'console-slack-log-sink-pubsub-publisher',
  {
    topic: topic.name,
    role: 'roles/pubsub.publisher',
    member: logSink.writerIdentity,
  },
  { protect: true, provider },
);

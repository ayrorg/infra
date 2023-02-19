import * as gcp from '@pulumi/gcp';
import * as google from '@pulumi/google-native';
import * as pulumi from '@pulumi/pulumi';
import { provider } from './provider';
import { project } from './project';
import { makePulumiCallback } from 'gcl-slack';

const config = new pulumi.Config('slack');
export const topic = new gcp.pubsub.Topic('onboarding-logger', {}, { provider });

export const serviceAccount = new google.iam.v1.ServiceAccount(
  'onboarding-slack-sa',
  {
    accountId: 'onboarding-slack-logger',
    project: project.projectId,
  },
  { dependsOn: project },
);

topic.onMessagePublished(
  'onboarding-new-log-entry',
  {
    region: 'europe-west1',
    runtime: 'nodejs18',
    serviceAccountEmail: serviceAccount.email,
    environmentVariables: {
      SLACK_TOKEN: config.require('bot-oauth-token'),
      DEFAULT_SLACK_CHANNEL: config.require('default-channel'),
    },

    callback: makePulumiCallback('api', {
      apiOptions: { defaultChannel: process.env.DEFAULT_SLACK_CHANNEL },
    }),
  },
  {},
  { provider },
);

const logSink = new gcp.logging.ProjectSink(
  'onboarding-slack-logger',
  {
    name: `onboarding-slack-logger-v1-prod`, // TODO: Make this dynamic
    filter: 'operation.producer="github.com/bjerkio/nestjs-slack@v1"',
    destination: pulumi.interpolate`pubsub.googleapis.com/${topic.id}`,
  },
  { protect: true, provider },
);

new gcp.pubsub.TopicIAMMember(
  'onboarding-slack-log-sink-pubsub-publisher',
  {
    topic: topic.name,
    role: 'roles/pubsub.publisher',
    member: logSink.writerIdentity,
  },
  { protect: true, provider },
);

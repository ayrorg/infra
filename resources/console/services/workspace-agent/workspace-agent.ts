import * as google from '@pulumi/google-native';
import * as config from './config';
import { PubSubService } from '../../../../components/pubsub-service';
import { posthogApiKey, posthogHost, project, viewerUsers } from '../../config';
import { serviceAccount } from './service-account';
import { bigQueryTable } from '../../google/big-query';

export const service = new PubSubService(config.name, {
  imageName: config.imageName,
  tag: config.tag,
  project,
  location: config.location,
  serviceAccount,
  invokerUsers: viewerUsers,
  path: '/update-subscriptions',
  envs: [
    { name: 'DATASET_ID', value: bigQueryTable.tableReference.datasetId },
    {
      name: 'DATASET_TABLE',
      value: bigQueryTable.tableReference.tableId,
    },
    {
      name: 'POSTHOG_HOST',
      value: posthogHost,
    },
    {
      name: 'POSTHOG_API_KEY',
      value: posthogApiKey,
    },
  ],
});

export const job = new google.cloudscheduler.v1.Job(
  config.name,
  {
    project,
    location: config.location,
    description: 'Retrieves license-count from Google Workspace',
    schedule: '0 12 * * *',
    timeZone: 'Europe/Oslo',
    pubsubTarget: {
      data: Buffer.from('{}').toString('base64'),
      topicName: service.topic.name,
    },
  },
  { deleteBeforeReplace: true },
);

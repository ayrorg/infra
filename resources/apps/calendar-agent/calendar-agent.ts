import * as config from './config';
import * as gcp from '@pulumi/gcp';
import * as google from '@pulumi/google-native';
import { developers } from '../../config';
import { project } from '../../google/project';
import { providers, provider } from '../../google/providers';
import { serviceAccount } from './service-account';
import { CloudRunService } from '../../components/cloudrun-service';
import { artifactRepoUrl } from '../../google/artifact-registry';
import { interpolate } from '@pulumi/pulumi';

export const service = new CloudRunService(
  config.name,
  {
    imageName: 'calendar-agent',
    registryUrl: artifactRepoUrl,
    tag: config.tag,
    project: project.name,
    location: config.location,
    serviceAccount,
    invokerUsers: developers,
    envs: [
      {
        name: 'SELF_URL',
        value: config.selfUrl,
      },
    ],
  },
  { providers },
);

export const domainMapping = new gcp.cloudrun.DomainMapping(
  config.name,
  {
    location: config.location,
    name: config.domain,
    metadata: { namespace: project.name },
    spec: {
      routeName: service.service.name,
    },
  },
  { provider: provider.gcp },
);

export const job = new google.cloudscheduler.v1.Job(
  'calendar-agent-daily-subscription-job',
  {
    location: config.location,
    description: 'Ensure subscription to all calendars enrolled with calendar-agent',
    schedule: '0 12 * * *',
    timeZone: 'Europe/Oslo',
    httpTarget: {
      httpMethod: 'GET',
      uri: new URL('/subscribe-all', config.selfUrl).toString(),
    },
  },
  { deleteBeforeReplace: true, provider: provider.google },
);

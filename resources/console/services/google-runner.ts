import * as pulumi from '@pulumi/pulumi';
import * as google from '@pulumi/google-native';
import * as gcp from '@pulumi/gcp';
import { consoleProject } from '../google/project';
import * as config from './config';
import { viewerUsers } from '../config';

export class GoogleRunnerService extends pulumi.ComponentResource {
  readonly serviceAccount: google.iam.v1.ServiceAccount;
  readonly invokerServiceAccount: google.iam.v1.ServiceAccount;
  readonly service: gcp.cloudrun.Service;
  readonly serviceIamPolicy: google.run.v1.ServiceIamPolicy;
  readonly topic: google.pubsub.v1.Topic;
  readonly scheduler: google.cloudscheduler.v1.Job;
  readonly subscriber: google.pubsub.v1.Subscription;

  constructor(opts?: pulumi.ComponentResourceOptions) {
    const name = 'workspace-runner';
    super('console-service:google-runner-v1', name, opts);

    const { projectId: project } = consoleProject;
    const { location } = config;

    const image = pulumi.interpolate`eu.gcr.io/${project}/${config.imageName}:${config.tag}`;

    this.serviceAccount = new google.iam.v1.ServiceAccount(
      name,
      {
        accountId: name,
        project,
      },
      { parent: this },
    );

    this.invokerServiceAccount = new google.iam.v1.ServiceAccount(
      `${name}-invoker`,
      {
        accountId: `${name}-invoker`,
        project,
      },
      { parent: this },
    );

    this.service = new gcp.cloudrun.Service(
      name,
      {
        location,
        project,
        template: {
          spec: {
            containerConcurrency: 80,
            serviceAccountName: this.serviceAccount.email,
            containers: [
              {
                image,
              },
            ],
          },
        },
      },
      { parent: this },
    );

    this.serviceIamPolicy = new google.run.v1.ServiceIamPolicy(
      name,
      {
        project,
        location,
        serviceId: this.service.name,
        bindings: [
          {
            members: [
              pulumi.interpolate`serviceAccount:${this.invokerServiceAccount.email}`,
              ...viewerUsers.map((u) => pulumi.interpolate`user:${u}`),
            ],
            role: 'roles/run.invoker',
          },
        ],
      },
      { parent: this },
    );

    this.topic = new google.pubsub.v1.Topic(
      name,
      { project, topicId: name },
      { parent: this },
    );

    this.subscriber = new google.pubsub.v1.Subscription(
      name,
      {
        project,
        topic: this.topic.name,
        subscriptionId: name,
        pushConfig: {
          oidcToken: {
            serviceAccountEmail: this.invokerServiceAccount.email,
          },
          pushEndpoint: pulumi.interpolate`${this.service.statuses[0].apply(
            (s) => s.url,
          )}/pubsub`,
        },
      },
      { parent: this },
    );

    this.scheduler = new google.cloudscheduler.v1.Job(
      name,
      {
        project,
        location,
        description: 'Retrieves license-count from Google Workspace',
        schedule: '0 12 * * *',
        pubsubTarget: {
          data: Buffer.from('{}').toString('base64'),
          topicName: this.topic.name,
        },
      },
      { parent: this, deleteBeforeReplace: true },
    );
  }
}

export const service = new GoogleRunnerService();

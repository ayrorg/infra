import * as pulumi from '@pulumi/pulumi';
import * as google from '@pulumi/google-native';
import * as gcp from '@pulumi/gcp';

export interface PubSubServiceProps {
  imageName: pulumi.Input<string>;
  tag: pulumi.Input<string>;
  project: pulumi.Input<string>;
  location: pulumi.Input<string>;
  serviceAccount?: google.iam.v1.ServiceAccount;
  invokerUsers?: string[];
  envs?: gcp.types.input.cloudrun.ServiceTemplateSpecContainerEnv[];
  path?: string;
}

export class PubSubService extends pulumi.ComponentResource {
  readonly serviceAccount: google.iam.v1.ServiceAccount;
  readonly invokerServiceAccount: google.iam.v1.ServiceAccount;
  readonly service: gcp.cloudrun.Service;
  readonly serviceIamPolicy: google.run.v1.ServiceIamPolicy;
  readonly topic: google.pubsub.v1.Topic;
  readonly subscriber: google.pubsub.v1.Subscription;
  readonly url: pulumi.Output<string>;

  constructor(
    name: string,
    args: PubSubServiceProps,
    opts?: pulumi.ComponentResourceOptions,
  ) {
    super('ayr-pubsub-service', name, opts);
    const {
      project,
      location,
      imageName,
      tag,
      invokerUsers = [],
      envs = [],
      serviceAccount,
      path = '/pubsub',
    } = args;

    const image = pulumi.interpolate`eu.gcr.io/${project}/${imageName}:${tag}`;

    this.serviceAccount =
      serviceAccount ??
      new google.iam.v1.ServiceAccount(
        name,
        {
          accountId: name,
          project,
        },
        { parent: this, deleteBeforeReplace: true },
      );

    this.invokerServiceAccount = new google.iam.v1.ServiceAccount(
      `${name}-invoker`,
      {
        accountId: `${name}-invoker-v2`,
        project,
      },
      { parent: this, deleteBeforeReplace: true },
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
                envs,
              },
            ],
          },
        },
      },
      { parent: this },
    );

    this.url = this.service.statuses[0].apply((s) => s?.url);

    this.serviceIamPolicy = new google.run.v1.ServiceIamPolicy(
      name,
      {
        project,
        location,
        serviceId: this.service.name,
        bindings: [
          {
            members: [
              'allUsers',
              pulumi.interpolate`serviceAccount:${this.invokerServiceAccount.email}`,
              ...invokerUsers.map((u) => pulumi.interpolate`user:${u}`),
            ],
            role: 'roles/run.invoker',
          },
        ],
      },
      { parent: this },
    );

    this.topic = new google.pubsub.v1.Topic(
      name,
      { project, topicId: `${name}-v2` },
      { parent: this, deleteBeforeReplace: true },
    );

    this.subscriber = new google.pubsub.v1.Subscription(
      name,
      {
        project,
        topic: this.topic.name,
        subscriptionId: `${name}-v2`,
        ackDeadlineSeconds: 360,
        pushConfig: {
          oidcToken: {
            serviceAccountEmail: this.invokerServiceAccount.email,
          },
          pushEndpoint: pulumi.interpolate`${this.url}/${path}`,
        },
      },
      { parent: this, dependsOn: this.service, deleteBeforeReplace: true },
    );
  }
}

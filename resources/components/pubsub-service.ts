import * as pulumi from '@pulumi/pulumi';
import * as google from '@pulumi/google-native';
import * as gcp from '@pulumi/gcp';
import { CloudRunService } from './cloudrun-service';

export interface PubSubServiceProps {
  imageName: pulumi.Input<string>;
  tag: pulumi.Input<string>;
  project: pulumi.Input<string>;
  location: pulumi.Input<string>;
  serviceAccount?: google.iam.v1.ServiceAccount;
  invokerUsers?: (pulumi.Output<string> | string)[];
  envs?: gcp.types.input.cloudrun.ServiceTemplateSpecContainerEnv[];
  path?: string;
  registryUrl?: string;
}

export class PubSubService extends pulumi.ComponentResource {
  readonly serviceAccount: google.iam.v1.ServiceAccount;
  readonly invokerServiceAccount: google.iam.v1.ServiceAccount;
  readonly service: CloudRunService;
  readonly topic: gcp.pubsub.Topic;
  readonly subscriber: google.pubsub.v1.Subscription;

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
      invokerUsers: rawInvokerUsers = [],
      envs = [],
      serviceAccount,
      path = '/pubsub',
      registryUrl = pulumi.interpolate`eu.gcr.io/${project}`,
    } = args;

    const invokerUsers = rawInvokerUsers.map((user) => pulumi.output(user));

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

    this.topic = new gcp.pubsub.Topic(
      name,
      {
        project,
        // topicId: `${name}-v2`,
        name,
      },
      { parent: this, deleteBeforeReplace: true },
    );

    this.service = new CloudRunService(
      name,
      {
        project,
        location,
        imageName,
        tag,
        invokerUsers,
        invokerServiceAccounts: [this.invokerServiceAccount.email],
        envs,
        serviceAccount,
        registryUrl,
      },
      { parent: this, dependsOn: this.invokerServiceAccount },
    );

    this.subscriber = new google.pubsub.v1.Subscription(
      name,
      {
        project,
        topic: this.topic.name,
        subscriptionId: name,
        ackDeadlineSeconds: 360,
        pushConfig: {
          oidcToken: {
            serviceAccountEmail: this.invokerServiceAccount.email,
          },
          pushEndpoint: pulumi.interpolate`${this.service.url}/${path}`,
        },
      },
      { parent: this, dependsOn: this.service, deleteBeforeReplace: true },
    );
  }
}

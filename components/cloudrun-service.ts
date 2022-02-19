import * as pulumi from '@pulumi/pulumi';
import * as google from '@pulumi/google-native';
import * as gcp from '@pulumi/gcp';

export interface CloudRunServiceProps {
  imageName: pulumi.Input<string>;
  tag: pulumi.Input<string>;
  project: pulumi.Input<string>;
  location: pulumi.Input<string>;
  serviceAccount?: google.iam.v1.ServiceAccount;
  invokerUsers?: (pulumi.Output<string> | string)[];
  invokerServiceAccounts?: (pulumi.Output<string> | string)[];
  envs?: gcp.types.input.cloudrun.ServiceTemplateSpecContainerEnv[];
  isPublic?: boolean;
}

export class CloudRunService extends pulumi.ComponentResource {
  readonly serviceAccount: google.iam.v1.ServiceAccount;
  readonly service: gcp.cloudrun.Service;
  readonly serviceIamPolicy: google.run.v1.ServiceIamPolicy;
  readonly url: pulumi.Output<string>;

  constructor(
    name: string,
    args: CloudRunServiceProps,
    opts?: pulumi.ComponentResourceOptions,
  ) {
    super('ayr-cloudrun-service', name, opts);
    const {
      project,
      location,
      imageName,
      tag,
      envs = [],
      serviceAccount,
      isPublic = true,
    } = args;

    const invokerUsers = (args.invokerUsers ?? []).map((u) => pulumi.output(u));
    const invokerServiceAccounts = (args.invokerServiceAccounts ?? []).map(
      (u) => pulumi.output(u),
    );

    const image = pulumi.interpolate`eu.gcr.io/${project}/${imageName}:${tag}`;
    const oldParent = `urn:pulumi:prod::infra-core::ayr-pubsub-service::${name}`;

    this.serviceAccount =
      serviceAccount ??
      new google.iam.v1.ServiceAccount(
        name,
        {
          accountId: name,
          project,
        },
        {
          parent: this,
          deleteBeforeReplace: true,
          aliases: [
            {
              name,
              parent: oldParent,
            },
          ],
        },
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
      {
        parent: this,
        aliases: [
          {
            name,
            parent: oldParent,
          },
        ],
      },
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
              ...(isPublic ? ['allUsers'] : []),
              ...invokerUsers.map((u) => pulumi.interpolate`user:${u}`),
              ...invokerServiceAccounts.map(
                (u) => pulumi.interpolate`serviceAccount:${u}`,
              ),
            ],
            role: 'roles/run.invoker',
          },
        ],
      },
      {
        parent: this,
        aliases: [
          {
            name,
            parent: oldParent,
          },
        ],
      },
    );
  }
}

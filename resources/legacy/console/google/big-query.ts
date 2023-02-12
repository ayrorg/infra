import * as pulumi from '@pulumi/pulumi';
import * as google from '@pulumi/google-native';
import * as config from '../config';
import { serviceAccount as workspaceAgentSa } from '../services/workspace-agent/service-account';

const name = 'console';
const location = config.location;
const project = config.project;

const datasetId = 'ayr_workspace_subscriptions';
const tableId = 'ayr_workspace_subscriptions_v1';

export const bigQueryDataset = new google.bigquery.v2.Dataset(name, {
  project,
  location,
  datasetReference: {
    datasetId,
  },
});

export const bigQueryTable = new google.bigquery.v2.Table(name, {
  project,
  datasetId: bigQueryDataset.datasetReference.datasetId,
  tableReference: {
    datasetId: bigQueryDataset.datasetReference.datasetId,
    tableId,
  },
  schema: {
    fields: [
      {
        name: 'billingMethod',
        mode: 'REQUIRED',
        type: 'STRING',
      },
      {
        name: 'creationTime',
        type: 'TIMESTAMP',
      },
      {
        name: 'exportedAt',
        mode: 'REQUIRED',
        type: 'TIMESTAMP',
      },
      {
        name: 'customerDomain',
        mode: 'REQUIRED',
        type: 'STRING',
      },
      {
        name: 'customerId',
        mode: 'REQUIRED',
        type: 'STRING',
      },
      {
        name: 'commitmentIntervalStartTime',
        type: 'TIMESTAMP',
      },
      {
        name: 'commitmentIntervalEndTime',
        type: 'TIMESTAMP',
      },
      {
        name: 'isCommitmentPlan',
        type: 'BOOL',
      },
      {
        name: 'planName',
        type: 'STRING',
      },
      {
        name: 'renewalType',
        type: 'STRING',
      },
      {
        name: 'numberOfSeats',
        type: 'INTEGER',
      },
      {
        name: 'maximumNumberOfSeats',
        type: 'INTEGER',
      },
      {
        name: 'licensedNumberOfSeats',
        type: 'INTEGER',
      },
      {
        name: 'skuId',
        type: 'STRING',
      },
      {
        name: 'skuName',
        type: 'STRING',
      },
      {
        name: 'subscriptionId',
        type: 'STRING',
      },
      {
        name: 'suspensionReasons',
        type: 'STRING',
        mode: 'REPEATED',
      },
      {
        name: 'isInTrial',
        type: 'BOOL',
      },
    ],
  },
});

export const tableIamPolicy = new google.bigquery.v2.TableIamPolicy(name, {
  project,
  datasetId: bigQueryDataset.datasetReference.datasetId,
  tableId: bigQueryTable.tableReference.tableId,
  bindings: [
    {
      members: [
        pulumi.interpolate`serviceAccount:${workspaceAgentSa.email}`,
        ...config.viewerUsers.map((u) => pulumi.interpolate`user:${u}`),
      ],
      role: 'roles/bigquery.dataOwner',
    },
  ],
});

// const a = new google.bigquerydatatransfer.v1.TransferConfig('hei',)


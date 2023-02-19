import { provider } from '../../google/provider';
import * as config from './config';
import * as gcp from '@pulumi/gcp';
import { service } from './freshworks-agent';
import { interpolate } from '@pulumi/pulumi';

export const schedulerServiceAccount = new gcp.serviceaccount.Account(
  'freshworks-scheduler',
  {
    accountId: 'freshworks-scheduler',
  },
  { provider },
);


export const scheduleDeleteUnknownCompanies = new gcp.cloudscheduler.Job(
  'delete-unknown-companies',
  {
    region: 'europe-west1',
    description: 'Deletes unknown companies from Freshdesk',
    schedule: '0 13 * * *',
    timeZone: 'Europe/Oslo',
    httpTarget: {
      httpMethod: 'GET',
      uri: interpolate`${service.url}/company/delete-unknown`,
      oidcToken: {
        serviceAccountEmail: schedulerServiceAccount.email,
      },
    },
  },
  { provider },
);

export const scheduleSynchronizeCompanies = new gcp.cloudscheduler.Job(
  'sync-companies',
  {
    region: 'europe-west1',
    description: 'Synchronizes companies from Tripletex to Freshdesk',
    schedule: '0 13 * * *',
    timeZone: 'Europe/Oslo',
    httpTarget: {
      httpMethod: 'GET',
      uri: interpolate`${service.url}/company/synchronize`,
      oidcToken: {
        serviceAccountEmail: schedulerServiceAccount.email,
      },
    },
  },
  { provider },
);

export const scheduleReportDanglingCompanies = new gcp.cloudscheduler.Job(
  'report-dangling-companies',
  {
    region: 'europe-west1',
    description: 'Reports dangling companies in Freshdesk',
    schedule: '0 0 * * 1',
    timeZone: 'Europe/Oslo',
    httpTarget: {
      httpMethod: 'GET',
      uri: interpolate`${service.url}/company/dangling`,
      oidcToken: {
        serviceAccountEmail: schedulerServiceAccount.email,
      },
    },
  },
  { provider },
);

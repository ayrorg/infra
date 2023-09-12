import * as gcp from '@pulumi/gcp';
import { project } from '../config';
import { websiteProject } from './project';

export const services = [
  'cloudbuild.googleapis.com',
  'cloudresourcemanager.googleapis.com',
  'serviceusage.googleapis.com',
  'servicemanagement.googleapis.com',
  'servicecontrol.googleapis.com',
  'container.googleapis.com',
  'compute.googleapis.com',
  'logging.googleapis.com',
  'stackdriver.googleapis.com',
  'monitoring.googleapis.com',
  'cloudtrace.googleapis.com',
  'clouderrorreporting.googleapis.com',
  'cloudprofiler.googleapis.com',
  'cloudfunctions.googleapis.com',
  'iam.googleapis.com',
];

export const apiServices = services.map(
  (service) =>
    new gcp.projects.Service(
      `ayr-website-${service}`,
      {
        service,
        disableOnDestroy: false,
        project,
      },
      {
        dependsOn: websiteProject,
        aliases: [
          {
            name: `website-${service.replace('.googleapis.com', '-api')}`,
            parent:
              'urn:pulumi:prod::infra-core::gcp-scaffold:index:project$gcp:organizations/project:Project::website-ayr-website',
          },
        ],
      },
    ),
);

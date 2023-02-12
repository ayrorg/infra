import './resources/legacy/console';
import './resources/legacy/core';
import './resources/legacy/github';
import './resources/legacy/google';
import './resources/legacy/onboarding';
import './resources/legacy/website';
import { serviceAccount } from './resources/legacy/console/google/reseller-service-account';

import './resources/google/gke';
import './resources/google/ip-address';
import './resources/kubernetes/ingress-controller';
import './resources/kubernetes/postgres-operator';

export const serviceAccountEmailAddress = serviceAccount.email;

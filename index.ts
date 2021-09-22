import './resources/console';
import './resources/github';
import './resources/google';
import './resources/website';
import { serviceAccountKey } from './resources/console/google/deploy-service-account'

export const key = serviceAccountKey.privateKeyData;

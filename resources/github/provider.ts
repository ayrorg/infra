import * as github from '@pulumi/github';
import { github as ghConfig } from '../config';

const { owner, token } = ghConfig;

export const provider = new github.Provider('main-github', {
  owner,
  token,
});

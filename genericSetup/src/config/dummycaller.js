
// const caller = require('./index');
import { set_env } from './index';
const env = set_env('development');
console.log('retrieved env: ', env);

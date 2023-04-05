import {MongoClient} from 'mongodb';
import Papr from 'papr';
import {env} from './config.js';
import {UserSchemaMongo} from '../schema/auth.js';

const client = new MongoClient(env.MONGODB_URI, {retryWrites: true, w: 'majority'});
const papr = new Papr();
papr.initialize(client.db('test'));
await papr.updateSchemas();

// Export collections
export const usersAccounts = papr.model('users.accounts', UserSchemaMongo);

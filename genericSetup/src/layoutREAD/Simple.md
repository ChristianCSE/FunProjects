
# Flow
So Route is invoked with some params.
Route, with the help of some controllHandler invokes a controller. 
Controller makes all the appropriate SERVICE (db) calls. 
Service with the given params, invokes the db and fetches what was requested. 

//router.js
```js
import { getUser } from '../controllers/user.js';

const helper = {
 methods: {}
};

helper.methods.extractUsername = (req, res, next) => [req.params.username];

/**
 * handles controller call (which returns a promise) and n parameters
 * @param  {function} promise [controller fxn call]
 * @param  {function} params [extracts relevant params for promise fxn call]
 * @return {?}         [?]
 */
const controllerHandler = (promise, params) => async (req, res, next) => {
 const boundParams = params ? params(req, res, next) : []; 
 try{
  const result = await promise(...boundParams);
  return res.json(result || { message: 'OK'} );
 } catch(error) {
  return res.status(500) && next(error);
 }
};

router.get('/users/:username', 
 controllerHandler(getUser, helper.methods.extractUsername)
);

```

//controllers/user.js
```js
import { 
 getUser as getUserService, 
 getUserChat as getUserChatService
} from '../service/user.js';

export async function getUser(username) {
 const user = await getUserService(username);
 const chat = await getUserChatService(user);
 return { user, chat };
}

```

//service/user.js
```js
import User from '../models/User';
export function getUser(username) => User.find({ username }).exec();
```

//models/User/user.js
```js
import { validateUsername } from './valdiate';

const userSchema = new Schema({
 username: {
  type: String, 
  unique: true, 
  valdiate: [{ validator: validateUsername, msg: 'Invalid username'}]
 }
}, { timestamp: true });
export default User; 
```

//models/User/validate.js
```js
export function validateUsername(username) {
 if(username==='') throw new Error('Invalid username');
 return true;
}
```









# Other Stuff 
//config/db_connections.js
```js
import Promise from 'bluebird';
import * as sequelizeConnect from '../database/sequelize';

const sequelize = {
  primary : sequelizeConnect.newClient({
    db: 'league_sample', 
    user: process.env.POSTGRES_USER, 
    password: process.env.POSTGRES_PW, 
    dialect: sequelizeConnect.DIALECT.POSTGRES
  })
};

const connectAll = () => {
  console.log('Connecting to db ...');
  return sequelizeConnect.connect(sequelize.primary)
  .tap((sequelizeClient) => {
    setTimeout(() => {
      sequelizeClient.sync({force: false});
    }, 3500);
  })
}

module.exports = {
  sequelize, 
  connectAll
};
```
//database/index.js
```js
'use strict';
import pg from 'pg';
import sequelize from 'sequelize'; 
import Promise from 'promise';

const DIALECT = Object.freeze({
  MYSQL: 'mysql'
});

const DIALECT_DEFAULT = {
  [DIALECT.MYSQL]: {
    PORT: 3306, 
    USER: 'root'
  }
};

const DEFAULT_CONFIG = (dbType) => ({
  dbType, 
  host: 'localhost', 
  port: DB_TYPE_DEFAULT[dbType].PORT, 
  pool : {
    max: 5, 
    min: 0, 
    idle: 1000
  }, 
  define: {
    timestamps: true
  }, 
  logging: false
});

//in the case you want to use sequilize orm (slow)
const newClient = (config={}) => {
  config.client = config.client || {};
  const clientConfig = Object.assign(DEFAULT_CONFIG(dialect), config.client);
  const client = new Sequelize(
    config.db, 
    config.user, 
    config.pass, 
    clientConfig
  );
  return client; 
};

const connect = (client) => {
  const dialect = client.connectionManager.dialectName; 
  const db = client.connectionManager.config.database;
  return Promise.resolve(client.authenticate())
  .then(() => {
    console.log(`${dialect}:${db} connected!`);
    return client;
  }).catch((err) => {
    console.error(`ERROR database.connect() ... ${dialect}:${db}`);
    return Promise.reject(err);
  });
};

module.exports = {
  newClient, 
  connect, 
  DIALECT
};

```










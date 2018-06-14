
import * as data from './data';//json file
import * as tables from './tables';
import * as database from './database';

/**
 * sequencePromises: processes an array of promises sequentially 
 * IOW, we cannot process the next promise until the other one is inserted ()
 * promises: Functions wrapped in promises
*/
const sequencePromises = (promises) => {
  //reduce function (value in array, returned value || init value)
  return promises.reduce((promise, promiseFunction) => {
    return promise.then(()=>{
      return promiseFunction(); //returns a Promise.resolve() 
    }).catch((err)=>{
      console.error('ERROR in seedData.sequencePromises(): ', err);
      return Promise.resolve(); //return promise.resolve() so we can still process the others!
    });
  }, Promise.resolve());
}

/**
 * createDatabase(): makes an array of create table sql queries from 
 * our sql.define() tables 
*/
const createDatabase = () => {
  console.log('\n createDatabase init ... \n');
  //All of these objects are constructed via sql.define()
  //we loop through our tables and make an array of functions 
  //these functions are create table sql queries yet to be exectured 
  let promises = [ tables.users, tables.usersFriends, tables.posts ]
  .map((table)=>{
    return () => database.getSql(table.create().toQuery());
  })
  return sequencePromises(promises); //exectutes the create table queries
}

const isUndef = (property, name) => {
  if (property === undefined) throw `${name} is undefined`;
}

const insertData = () => {
  //TODO: should probably have in some testing folder rather than here
  let { users, posts, usersFriends } = data;
  try {
    isUndef(users, 'users');
    isUndef(posts, 'posts');
    isUndef(usersFriends, 'usersFriends');
  } catch (err) {
    console.error('ERROR seedData.insertData(): ', err);
    return;
  }

  //insert into table() values() sql query 
  let queries = [
    tables.users.insert(users).toQuery(),
    tables.posts.insert(posts).toQuery(), 
    tables.usersFriends.insert(usersFriends).toQuery()
  ];

  let promises = queries.map((qry) => {
    return () => database.getSql(qry);
  });
  
  return sequencePromises(promises);
}

createDatabase()
.then(() => insertData())
.then(() => {
  console.log({ done: true });
})
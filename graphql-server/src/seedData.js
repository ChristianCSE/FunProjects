



//json file 
import * as data from './data';
import * as tables from './tables';
import * as database from './database';


// const sequencePromises = function(promises) {}

const sequencePromises = (promises) => {
  console.log('committing db actions ...');
  //the way reduce works is that it inits promise 
  //with the [].reduce((initVal, from arr) => { return new initVal}, initVal)
  return promises.reduce((promise, promiseFunction) => {
    return promise.then(() =>{
      console.log('committing ...');
      return promiseFunction(); //this will return the new promise.then() 
    }).catch((err)=> {      
      console.error(err);
      return Promise.resolve();
    });
  }, Promise.resolve());
}

const createDatabase = () => {
  //makes an array of promises 
  console.log('create DB ...');
  //had error in refencing a non-existant table
  let promises = [tables.users, tables.usersFriends, tables.posts]
  .map((table)=>{
    //makes table into query and sends it to our getSql 
    //promise wrapping function 
    //note that we are holding anonymous functions that 
    //have yet to be invoked
    console.log('Doing ....', table);
    return () => database.getSql(table.create().toQuery());
  });

  return sequencePromises(promises);
}
const isUndef = (property, name) => {
  if(property === undefined) throw `${name} is undefined`;
};

const insertData = () => {
  console.log('pulling insert data ...');  
  let { users, posts, usersFriends } = data; 
  try {
    isUndef(users,'users');
    isUndef(posts,'posts');
    isUndef(usersFriends,'usersFriends');
  } catch(err) {
    console.error('ERROR: ', err);
    // return Promise.reject();
    return;
  }

  let queries = [
    tables.users.insert(users).toQuery(),
    tables.posts.insert(posts).toQuery(), 
    tables.usersFriends.insert(usersFriends).toQuery()
  ];
  console.log('wrapping inserts with promises ...');
  let promises = queries.map((qry) => {
    return () => database.getSql(qry);
  });
  console.log('wrapped inserts with promises ...');
  return sequencePromises(promises);
}


createDatabase()
.then(() => {
  console.log('insert data ...');
  return insertData();
}).then(() => {
  console.log('... did not reach?');
  console.log({ done: true });
})







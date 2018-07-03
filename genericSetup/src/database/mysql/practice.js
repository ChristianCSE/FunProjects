import { getSQL } from './index.js';
import * as Promise from 'bluebird';

const cleanUsers = (table, limit) => {
  const query = 'SELECT * FROM ?? LIMIT ?';
  return getSQL(query, [table, limit])
  .then((row) => {
    console.log(row);
    return row;
  })
  .catch((err) => {
    console.error('ERROR in cleanUsers: ', err);
  })
}


const getUsr = () => {
  return getSQL('SELECT * FROM user LIMIT 10')
  .then((row) => {
    console.log(row.length);
    for(let i = 0; i < row.length; i++){
      console.log( row[i]);
    }
    console.log(row);
    return row;
  })
  .catch((err) => {
    console.log(err);
  })
}

getUsr();

const getMult = () => {
  let users = getSQL('SELECT * FROM `user` LIMIT 10');
  let business = getSQL('SELECT * FROM `business` LIMIT 10');
  let reviews = getSQL('SELECT user_id, business_id, stars FROM `review` LIMIT 10');
  let complex = getSQL(
    `
    SELECT * FROM review r, business b 
    where r.business_id = b.id 
    limit 10
    `
  );  
  return Promise.all(
    [
    users,
    complex,
    business, 
    reviews
    ]
  ).then(([users, complex, business, reviews]) => {
    
  }).catch((err) => {
    console.error('ERROR getMult: ', err);
  })
}


const helper = {
  extractor: {}
};


helper.extractor.name = (req, res, next) => [req.user.username];

const controllerHandler = (promiseGet, params) => {
  return async (req, res, next) => {
    const boundParams = params ? params(req) : [];
    try {
      const result = await promiseGet(...boundParams); //spread (since you are returned an array)
      console.log('result: ', result);
      return result;
      //return res.json(result || { message: 'OK'});
    } catch(error) {
      console.error('ERROR: ', error);
      return error;
      //return res.status(500); // && next(error);
    }
  }
}

const likeMe = (name) => {
  let myQuery = `
    SELECT count(*) FROM 
    user 
    where name = ?
  `;
  return getSQL(myQuery, [name])
  .then((likeMeCount) => {
    console.log('is this still casted as a Promise:');
    return likeMeCount;
  })
  .catch((err) => {
    throw Error('Generic fetch error', err);
  })
}

const basicPerson = {
  user: {
    username: 'Bob'
  }
};

//controllerHandler(likeMe, helper.extractor.name)(basicPerson);


// getMult();
// cleanUsers('user', 10);
// getUsr();
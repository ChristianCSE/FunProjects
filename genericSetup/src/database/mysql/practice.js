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
    console.log(row);
    return row;
  })
  .catch((err) => {
    console.log(err);
  })
}


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




// getMult();
// cleanUsers('user', 10);
// getUsr();
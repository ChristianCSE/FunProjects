/*
import { connection as dbConn } from './index.js';



const genericRowRetrieval = (rows) => {
  console.log('rows'); 
  return rows;
  // return Promise.resolve(rows);
}

const genericDBError = (err, methodName) => {
  console.error(`ERROR ${methodName}: `, err);
  throw Error; 
}


const getUsers = (limit) => {
  const getUsersQuery = `SELECT * FROM \`user\` limit ${limit}`;
  return dbConn.query(getUsersQuery)
  .on('result', genericRowRetrieval)
  .on('error',genericDBError);
}

const something = () => {
  return new Promise((res,err) => {
    res(getUsers());
  })
}


const viewThem = () => {
  return getUsers(10, (rows) => {
    console.log('rowsssssss: ', row);
  });
}
viewThem();

*/

// import { pool } from './index.js';

// //we are sending a method to getConnection
// pool.getConnection((err, conn) => {
//   if (err) throw err; 
//   if (!conn) throw new Error('conn DNE: ', conn);
//   conn.query('SELECT * FROM user LIMIT 10', (err, res, fields) => {
//     conn.release(); 
//     if(err) throw err; 
//     console.log(res);
//     // console.log(fields);
//   })
// })

// const connection = (query) => {
//   return Promise.resolve((res, rej) => {
//     return res();
//   })
// }



// return getSql().then((row) => {
//   console.log('GOT: ', row);
// }).catch((err) => {
//   console.error('ERROR: ', err);
// })

// const getSql = (query) => {
//   return new Promise((res, rej) => {

//     db.all(query.text, query.values, (err, rows) => {
//       if(err) rej(err);
//       res(rows);
//     })
//   })

// }




import { getSQL } from './index.js';
import * as Promise from 'bluebird';

// getSQL('SELECT * FROM user LIMIT 10')
// .then((row) => {
//   console.log('Got response: ', row); 
// })
// .catch((err) => {
//   console.error('ERROR: ', err);
// })



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

getMult();


// cleanUsers('user', 10);
// getUsr();
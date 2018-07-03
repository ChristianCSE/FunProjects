//setup the db environment 
//connect the db in middleware.js


import * as Promise from 'bluebird';
import * as mysql from 'mysql';
import { Z_VERSION_ERROR } from 'zlib';
import { POINT_CONVERSION_COMPRESSED } from 'constants';

const DB_CONFIG = {
  host: 'localhost', 
  user: 'root', 
  password: process.env.DBPASSWORD, 
  database: 'music'
};

// const db = Promise.promisifyAll(mysql.createConnection(DB_CONFIG));
//Promise.promisifyAll will not work due to mysql not have format 
//expected by bluebird
const pool = mysql.createPool(DB_CONFIG); 

// pool.connect((err) => {
//   if(err){
//     console.error('ERROR connection: ', err.stack);
//     return;
//   }
//   console.log('connected as id ', db.threadId);
// });

const connection = {
  query: function() {
    //arrow fxn (=>) doesn't allow arguments; hence, explicit function 
    //prototype.slice.call() returns a shallow copy (og not effected)
    //you should pass your query as 
    //"select * from `user` where `user_id` = ?" 
    //, desired_user_id, ... all other filling ? args

    //we use Array.prototype.slice.call() 
    //since arguments IS NOT an array 
    let queryArgs = Array.prototype.slice.call(arguments), 
      events = [], 
      eventNameIndex = {}; 
      
    //this is not even executed when we call query()
    //on() is invoked first 
    pool.getConnection((err, conn) =>{
      //eventIndex.error is how we treat the error 
      //err implies not connected (we have no control over that)
      //normal syntax throw err; 
      if(err && eventNameIndex.error) eventNameIndex.error();
      if(conn) {
        //conn.query refers to this, apply is setting this to our current 
        //connection and then sending the arguments accepted by apply()
        let q = conn.query.apply(conn, queryArgs);
        
        q.on('end', () => { conn.release(); });
        events.forEach((args) => { 
          
          //on each row...? apply the callback? 
          q.on.apply(q, args); 
        });
      }
    });

    return {
      on : function(eventName, callback) {
        //in this scenario, 
        //arguments === eventName, callback 
        events.push(Array.prototype.slice.call(arguments)); 
        
        eventNameIndex[eventName] = callback; 
        return this; //allow chaining 
      }
    }
  }
}

// const wtfCallback = (row) => { console.log('row', row); };
// const wtfErrorCallback = (err) => { console.error('err', err); };
// const myQuery = "SELECT * FROM `user` limit 10";
// connection.query(myQuery)
// .on('result', wtfCallback)
// //THIS HAS TO BE ERROR, this is part of mysql package
// .on('error', wtfErrorCallback);

module.exports = {
  connection
}

// function caller(){
//   setTimeout(()=>{
//     const myQuery = "SELECT * FROM `user` limit 10";
//     connection.query(myQuery)
//     .on('result', (row) => {
//       console.log('got row: ', row);
//       console.log('closing ...');
//     }).on('error', (err) => {
//     console.error('err ', err);
//   });
//   }, 3000);
// }
// for(let i = 0; i < 1; i++){
//   caller();
//   console.log(i);
// }


// module.exports = {

// }
//caller syntax
/*
const db = require('./db.js');
const myQuery = "SELECT * FROM `table` WHERE `id` = ?"; 
db.connection.query(myQuery, row_id)
.on('result', (row) => {
  
})
.on('error', (err) => {
  
})
*/

/*
function something(){
  dbPool.getConnection((err, connection) => {
    if(err) return; 
    const sql = "SELECT * FROM user LIMIT 10";
    connection.query(sql, [], (err, res) => {
      connection.release(); //put connection back in pool after last query
      if(err) {
        console.error('ERROR query: ', err);
        
      }
    })

  })
}
*/
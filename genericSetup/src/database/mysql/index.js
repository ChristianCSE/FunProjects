import * as mysql from 'mysql';

const DB_CONFIG = {
  host: 'localhost', 
  user: 'root', 
  password: process.env.DBPASSWORD, 
  database: 'yelp'
};

const pool = mysql.createPool(DB_CONFIG); 


const connection = {
  query: function() {
    
    let queryArgs = Array.prototype.slice.call(arguments), 
      events = [], 
      eventNameIndex = {}; 
      
    pool.getConnection((err, conn) =>{
      if(err && eventNameIndex.error) eventNameIndex.error();
      if(conn) {
        let q = conn.query.apply(conn, queryArgs);
        q.on('end', () => { conn.release(); });
        events.forEach((args) => { q.on.apply(q, args); });
      }
    });

    return {
      on : function(eventName, callback) {
        events.push(Array.prototype.slice.call(arguments)); 
        eventNameIndex[eventName] = callback; 
        return this;
      }
    }
  }
}


const getSQL = (query, arr) => {
  return new Promise((res, rej) => {
    pool.getConnection((err, conn) => {
      if(err) throw err; 
      if(!conn) throw new Error('ERROR connection: ', conn);
      conn.query(query, arr, (err, row, fields) => {
        conn.release();
        if(err) throw err; 
        console.log('\n DONE! ', query);
        res(row);
      });
    });
  });
}

module.exports = {
  connection,
  pool, 
  getSQL
}

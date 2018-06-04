
import sqlite3 from 'sqlite3';
import * as tables from './tables';

export const db = new sqlite3.Database('./db.sqlite');


//we wrap our get request with a promise 
//to run our queries as async promises 
export const getSql = (query) => {
  return new Promise((res, rej) => {
    console.log(query.text);
    console.log(query.values); 
    //idk what db.all does 
    db.all(query.text, query.values, (err, rows) => {
      if(err) rej(err); 
      res(rows);
    })
  })
}




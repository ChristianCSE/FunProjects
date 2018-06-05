
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
    //so db.all
    console.log('About to invoke query ...');
    //I'm guessing it looks like select ? from ? where id = ? 
    //and values are the ? fillings
    console.log('query.text: ', query.text);
    console.log('query.values: ', query.values);
    db.all(query.text, query.values, (err, rows) => {
      //callback
      if(err) rej(err); 
      //if no error resolve and invoke next function
      res(rows);
    })
  })
}




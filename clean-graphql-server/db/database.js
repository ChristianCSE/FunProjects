//NOTE: Unlike tables.js, we import sqlite3 NOT sql
import sqlite3 from 'sqlite3';
import * as tables from '../tables';
import { rejects } from 'assert';

/**
 * getSql(): returns rows after executing query
 * requires sql query (toQuery()) object
*/
export const getSql = (query) => {
  return new Promise((res, err) => {
    db.all(query.text, query.values, (err, rows) => {
      if(err) rej(err);
      res(rows);
    })
  })
}

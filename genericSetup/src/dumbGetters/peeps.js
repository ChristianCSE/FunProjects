import { getSQL } from './../database/mysql/index.js';
//import * as Promise from 'bluebird';



const fetchUsers = () => {
  const query  = `SELECT * FROM user limit 10`;
  return getSQL(query);
}


module.exports = {
  fetchUsers
};
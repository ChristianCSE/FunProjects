//using sqlite for our db
//setting models 
import sql from 'sql';

sql.setDialect('sqlite');

//so we have our table name = name, 
//then we have our columns which is column property 
//with an array of objects, each representing an indiv col (attrb)
export const users = sql.define({
  name: 'users', 
  columns: [{
    name: 'id', 
    dataType: 'INTEGER', 
    primaryKey: true 
  }, {
    name: 'name', 
    dataType: 'text'
  }, {
    name: 'about', 
    dataType: 'text'
  }]
});



export const usersFriends = sql.define({
  name: 'users_friends', 
  columns: [{
    name: 'user_id_a', 
    dataType: 'int'
  }, {
    name: 'user_id_b', 
    dataType: 'text'
  }, {
    name: 'level', 
    dataType: 'text'
  }]
});


export const posts = sql.define({
  name: 'posts', 
  columns: [{
    name: 'id', 
    dataType: 'INTEGER',
    primaryKey: true
  }, {
    name: 'user_id', 
    dataType: 'int'
  }, {
    name: 'body', 
    dataType: 'text'
  }, {
    name: 'level', 
    dataType: 'text'
  }, {
    name: 'created_at', 
    dataType: 'datetime'
  }]
});

//NOTE: Enforcing GLOBALLY UNIQUE ID
export const dbIdToNodeId = (dbId, tableName) => {
  if(dbId === undefined) console.error('dbId is undef!');
  if(tableName === undefined) console.error('tableName undef!');
  
  return `${tableName}:${dbId}`;
}

export const splitNodeId = (node) => {
  const [tableName, dbId] = node.split(':');
  return { tableName, dbId };
}
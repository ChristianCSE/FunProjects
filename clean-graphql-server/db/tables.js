//https://github.com/brianc/node-sql
import sql from 'sql';
sql.setDialect('sqlite'); //set sql language we're using

//NOTE: We are creating a table
//Name = table name & Columns = properties & types
export const users = sql.define({
  name: 'users', 
  columns: [
    {
      name: 'id',
      dataType: 'Integer', 
      primaryKey: true
    },
    {
      name: 'name', 
      dataType: 'text'
    },
    {
      name: 'about',
      dataType: 'text'
    },
  ]
});

//NOTE: usersFriends is referring to the "object"
//its table name is users_friends!
//NOTE: NO PRIMARY KEY! (we probs should be using foreign keys)
//not sure if this library supports it though
export const usersFriends = sql.define({
  name: 'users_friends', 
  columns: [
    {
      name: 'user_id_a', 
      dataType: 'int'
    },
    { 
      name: 'user_id_b', 
      dataType: 'text'
    },
    {
      name: 'level', 
      dataType: 'text'
    }
  ]
});


export const posts = sql.define({
  name: 'posts', 
  columns: [
    {
      name: 'id', 
      dataType: 'INTEGER', 
      primaryKey: true
    }, 
    {
      name: 'user_id', 
      dataType: 'int'
    }, 
    {
      name: 'body', 
      dataType: 'text'
    }, 
    {
      name: 'level', 
      dataType: 'text'
    }, 
    {
      name: 'created_at', 
      dataType: 'datetime'
    }
  ]
});

//NOTE: we concat id & table to make the id globally unique 
export const dbIdToNodeId = (dbId, tableName) => {
  if(dbId === undefined) console.error('dbIdToNodeId: dbId is undef!'); 
  if(tableName === undefined) console.error('dbIdToNodeId: tableName is undef!');
  return `${tableName}:${dbId}`;
}

export const splitNode = (node) => {
  const [tableName, dbId] = node.split(':');
  return { tableName, dbId };
}
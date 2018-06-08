
import * as database from './database';
import * as tables from './tables';


export const getNodeById = (nodeId) => {
  //splits id on their tableName:ID (format is due to needing GLOBALLY UNIQUE KEY)
  const { tableName, dbId } = tables.splitNodeId(nodeId);
  
  const table = tables[tableName];
  //select * from tableName where id = dbId limit 1 
  //to Query (so we haven't accessed the db yet)
  const query = table
  .select(table.star())
  .where(table.id.equals(dbId))
  .limit(1)
  .toQuery();
  //fxn is wrapped in promise
  //promise is returned in resolve
  //so if we did const container = database.getSql(query); 
  //we would have a pending promise!
  return database.getSql(query)
  .then((rows) => {
    if(rows[0]) rows[0].__tableName = tableName; 
    return rows[0];
  })
}

//want getFriendIdsForUser
//had getFriendsForUser
export const getFriendIdsForUser = (userSource) => {
  
  //probably use better naming than 
  //table (will confuse and use tables)
  const table = tables.usersFriends; 

  //Construct Query 
  const query = table
  .select(table.user_id_b)
  .where(table.user_id_a.equals(userSource.id))
  .toQuery(); //makes into query object (text, values)
  //without toQuery it's some object with a bunch of 
  //attributes and fxns 
  
  console.log('some query object: ', query);

  //invokes query and returns Promise & data 
  return database.getSql(query)
  .then((rows)=>{
    //per row makes tableName = getName which is the name of the user
    rows.forEach((row)=>{
      row.__tableName = tables.users.getName();
    });
    console.log('rows: ', rows);

    return rows;
  })
}

export const getUserNodeWithFriends = (nodeId) => {
  //NOTE: remember that we made our id unique by 
  //concattenating table:id
  const { tableName, dbId } = tables.splitNodeId(nodeId); 
  //NOTE: table.something get's translated to sql query syntax 
  
  //This is supposed to get the user's profile along with all of their friends. 
  //odd ... that it's using a left join
  const query = tables.users
  .select(tables.usersFriends.user_id_b, tables.users.star())
  .from(
    tables.users.leftJoin(tables.usersFriends)
    .on(tables.usersFriends.user_id_a.equals(tables.users.id))
  )
  .where(table.users.id.equals(dbId))
  .toQuery();

  console.log('constructed query by getUserNodeWithFreinds: ', query);
  
  return database.getSql(query)
  .then((rows)=> {

    if (!rows[0]) return undefined; 

    const __friends = rows.map(
      (row) => {
        return {
          user_id_b : row.user_id_b, 
          __tabeleName: tables.users.getName()
        };
      }
    );

    const source = {
      id: rows[0].id, 
      name: rows[0].name,
      about: rows[0].about,
      __tableName: tableName,
      __friends: __friends
    }
    
    return source; 
  })
}
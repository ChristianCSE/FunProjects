
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


export const getFriendsForUser = (userSource) => {
  const table = table.usersFriends; 
  const query = table
  .select(table.user_id_b)
  .where(table.user_id_a.equals(userSource.id))
  .toQuery(); //makes into query object (text, values)

  return database.getSql(query)
  .then((rows)=>{
    rows.forEach((row)=>{
      row.__tableName = table.users.getName();
    });
    return rows;
  })
}
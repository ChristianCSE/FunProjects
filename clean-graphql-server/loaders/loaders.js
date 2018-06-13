
import * as database from '../db/database';
import * as tables from '../db/tables';
import DataLoader from 'dataloader';

//table:
//ids: 
//returns: 
const createNodeLoader = (table) => {
  return new DataLoader((ids) => {
    const curr = 'createNodeLoader'
    //select * from $table where $table.id in ($ids);
    const query = table.select(table.star())
    .where(table.id.in(ids))
    .toQuery();
    
    console.log(curr, ' query: ', query);
    
    return database.getSql(query).then((rows)=>{
      rows.forEach((row)=>{
        row.__tableName = table.getName();
      });

      console.log(curr, ' rows: ', rows);

      return rows;
    });
  });
}

const nodeLoaders = {
  users: createNodeLoader(tables.users), 
  posts: createNodeLoader(tables.posts),
  userFriends: createNodeLoader(tables.userFriends)
};

export const getNodeById = (nodeId) => {
  const { tableName, dbId } = tables.splitNodeId(nodeId); 
  return nodeLoaders[tableName].load(dbId);
}

export const getFriendIdsForUser = (userSource) => {
  const curr = 'getFriendIdsForUser';
  const table = tables.usersFriends; 
  //select $table.user_id_b where $table.user_id_a = $userSource.id
  const query = table.select(table.user_id_b)
  .where(table.user_id_a.equals(userSource.id))
  .toQuery();

  console.log(curr, ' query: ', query);

  return database.getSql(query).then((rows)=>{
    rows.forEach((row)=>{
      row.__tableName = tables.users.getName();
    });

    console.log(curr, ' rows: ', rows);

    return rows;
  });
}

export const getUserNodeWithFriends = (nodeId) => {
  const { tableName, dbId } = tables.splitNodeId(nodeId);
  const query = tables.users
  .select(tables.usersFriends.user_id_b, tables.users.star())
}
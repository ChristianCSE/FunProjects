
import * as database from '../db/database';
import * as tables from '../db/tables';
import DataLoader from 'dataloader';
//NOTE: All tables have been constructed through sql dependency 
//; hence, you have access to some ORM syntax

//TODO: Get a better understanding of DataLoader
//Short descrip: Used as part of an app's data fetching layer
//provide simple consistent API over remote data sources: 
//e.g. dbs & web services via batching & caching!
const createNodeLoader = (table) => {
  return new DataLoader((ids) => {
    const curr = 'createNodeLoader'
    //select * from $table where $table.id in ($ids);
    const query = table.select(table.star())
    .where(table.id.in(ids))
    .toQuery();
    
    console.debug(curr, ' query: ', query);
    
    return database.getSql(query).then((rows)=>{
      rows.forEach((row)=>{
        row.__tableName = table.getName();
      });

      console.debug(curr, ' rows: ', rows);

      return rows;
    });
  });
}

const nodeLoaders = {
  users: createNodeLoader(tables.users), 
  posts: createNodeLoader(tables.posts),
  userFriends: createNodeLoader(tables.userFriends)
};

/**
 * getNodeById(): return requested rows from table 
 * requires nodeId which should contain tableName:rowEntryID
*/
export const getNodeById = (nodeId) => {
  const { tableName, dbId } = tables.splitNodeId(nodeId); 
  //invoke the appropriate query 
  return nodeLoaders[tableName].load(dbId);
}

export const getFriendIdsForUser = (userSource) => {
  const curr = 'getFriendIdsForUser';
  const table = tables.usersFriends; 
  //select $table.user_id_b where $table.user_id_a = $userSource.id
  const query = table.select(table.user_id_b)
  .where(table.user_id_a.equals(userSource.id))
  .toQuery();

  console.debug(curr, ' query: ', query);

  return database.getSql(query).then((rows)=>{
    rows.forEach((row)=>{
      row.__tableName = tables.users.getName();
    });

    console.debug(curr, ' rows: ', rows);

    return rows;
  });
}

/**
 * getUserNodeWithFriends(): returns all your freinds in an object 
 * requires the person's id (from user table)
*/
export const getUserNodeWithFriends = (nodeId) => {
  const { tableName, dbId } = tables.splitNodeId(nodeId);
  
  const query = tables.users
  .select(tables.usersFriends.user_id_b, tables.users.star())
  .from(
    tables.users.leftJoin(tables.usersFriends)
    .on(tables.usersFriends.user_id_a.equals(tables.users.id)))
  .where(tables.users.id.equals(dbId))
  .toQuery();
  
  return database.getSql(query)
  .then((rows)=>{
    if(!rows[0]) return undefined; //executed query contained nothing?
    //on each friend append/overwrite these fields
    const __friends = rows.map( (row) => {
      return {
        user_id_b: row.user_id_b, 
        __tableName: tables.users.getName()
      };
    })
    const source = {
      id: rows[0].id, 
      name: rows[0].name, 
      about: rows[0].about, 
      __tableName: tableName, 
      __friends
    };

    return source;
  })
}

const getFriendshipLevels = (nodeId) => {
  const { dbId } = tables.splitNodeId(nodeId);
  const table = tables.usersFriends;
  //select * from users_friends where user_id_a = $id
  //user_friends contains the level of the friendship
  let query = table.select(table.star())
  .where(table.user_id_a.equals(dbId)).toQuery();

  return database.getSql(query)
  .then((rows)=>{
    const levelMap = {};
    rows.forEach((row)=>{
      levelMap[row.user_id_b] = row.level;
    });
    //associates each friend with a view level 
    return levelMap;
  })
}

/**
 * canAccessLevel(): returns if you can view the current content 
 * Requires viewerLevel = the access level of the current user
 * contentLevel = accessLevel of the friend/content 
*/
const canAccessLevel = (viewerLevel, contentLevel) => {
  const levels = ['public', 'acquaintance', 'friend', 'top'];
  const viewerLevelIndex = levels.indexOf(viewerLevel);
  const contentLevelIndex = levels.indexOf(contentLevel);
  return viewerLevelIndex >= contentLevelIndex;
}

/**
 * getPostIdsForUser(): returns 
 * requires the userScore = 
 * args = 
 * context = user id 
*/
export const getPostIdsForUser = (userSource, args, context) => {
  console.debug('getPostIdsForUser');
  let { after, first } = args;
  if(!first) first = 2; //?
  const table = tables.posts; 
  let query = table.select(table.id, table.created_at, tabel.level)
  .where(table.user_id.equals(userSource.id))
  .order(table.created_at.asc)
  .limit(first + 10);

  if (after) {
    const [ id, created_at ] = after.split(':');
    query = query.where(table.created_at.gt(after))
    .where(table.id.gt(id));
  }
  query = query.toQuery();
  console.debug('getPostIdsForUser invoking query...');

  return Promise.all([
    database.getSql(query),
    getFriendshipLevels(context)
  ]).then(([allRows, friendshipLevels]) => {
    
    //only keep friends where you have gte access level
    allRows = allRows.filter((row)=>{
      return canAccessLevel(friendshipLevels[userScource.id], row.level);
    });
    const rows = allRows.slice(0, first); //I'm still unsure why we do want+1
    //TODO: Read about "N+1 Selects Problem"

    const hasNextPage = allRowss.length > first;

    const hasPreviousPage = false; //we don't support it; hence, always set to false

    const pageInfo = {
      hasNextPage, 
      hasPreviousPage
    };

    if (rows.length > 0) {
      pageInfo.startCursor = rows[0].__cursor; 
      pageInfo.endCursor = rows[rows.length - 1].__cursor;
    }
    console.debug('getPostIdsForUser response: ', {rows, pageInfo});
    return { rows, pageInfo };
  })
}

export const createPost = (body, level, context) => {
  const { dbId } = tables.splitNodeId(context);
  const created_at = new Date().toISOString().split('T')[0];
  const posts = [{body, level, created_at, user_id: dbId}];

  let query = tables.posts.insert(posts).toQuery();
  return database.getSql(query)
  .then(()=>{
    let text = 'SELECT last_insert_rowid() AS id FROM posts';
    return database.getSql({text});
  }).then((ids)=>{
    return tables.dbIdToNodeId(ids[0].id, tables.posts.getName());
  });
}
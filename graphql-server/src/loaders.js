
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
    //we are doing a left join with users & usersFriends table 
    tables.users.leftJoin(tables.usersFriends)
    //properties usersFriends.user_id_a = users.id 
    .on(tables.usersFriends.user_id_a.equals(tables.users.id))
  )
  //the person we care about is from our args id
  .where(tables.users.id.equals(dbId))
  .toQuery();

  console.log('constructed query by getUserNodeWithFreinds: ', query);
  
  return database.getSql(query)
  .then((rows)=> {
    //this is our db response
    if (!rows[0]) return undefined; 

    //go through each individual row and make 
    //a friends array filed with objects, each individual 
    //object is a friend represented by their id and name
    const __friends = rows.map(
      (row) => {
        return {
          user_id_b : row.user_id_b, 
          //you spelled table incorreclty; hence, you had undefined:#
          __tableName: tables.users.getName()
        };
      }
    );

    //source: looks like some payload, but I'm unsure 
    //why we use row[0]? does that represent you? 
    const source = {
      id: rows[0].id, 
      name: rows[0].name,
      about: rows[0].about,
      __tableName: tableName,
      __friends: __friends
    }
    console.log('what is source: ', source);
    return source; 
  })
}


export const getPostIdsForUser = (userSource, args) => {
  console.log('getPostIdsForUser');
  let { after, first } = args; 
  if (!first) first = 2; 
  const table = tables.posts; 
  
  //Getting all the posts made by the user
  //select id, created_at from post where user_id = 'given_id'
  //order by created_at asc limit first+1
  let query = table
  .select(table.id, table.created_at)
  .where(table.user_id.equals(userSource.id))
  .order(table.created_at.asc)
  .limit(first + 1); //requesting 1 more row than what the user requested (hence slice)

  console.log('before checking after ...');
  //NOTE: Checking if after cursor was passed 
  //cursor, in this case, are strings composed of row ids & row dates
  if (after) {
    //if user provide an after arg in their node() graphql look up
    const [ id, created_at ] = after.split(':'); 
    //seems continue to append where conditionals to our query ... ? 
    query = query
    .where(table.created_at.gt(after))
    .where(table.id.gt(id));
  }

  const actualQuery = query.toQuery();
  console.log('making query request: ', actualQuery);
  return database.getSql(actualQuery)
  .then((allRows) => {
    console.log('getPostIdsForUser db response', allRows); 
    const rows = allRows.slice(0, first); //prev requested +1 
      //constructing cursor for each row 
    rows.forEach((row) => {
      //tableName is set for future join
      row.__tableName = tables.posts.getName(); 
      row.__cursor = row.id + ':' + row.created_at; 
    })
    const hasNextPage = allRows.length > first;
    //we don't support before & last arg; hence
    //, we set hasPreviousPage to false
    const hasPreviousPage = false; 
    const pageInfo = {
      hasNextPage: hasNextPage, 
      hasPreviousPage: hasPreviousPage
    };
    //set the cursors to the first & last args from our elements array
    if (rows.length > 0) {
      pageInfo.startCursor = rows[0].__cursor; 
      //how the hell does it not throw an error for this?????
      //pageInfo.endCursor - rows[rows.length  - 1].__cursor;
      pageInfo.endCursor = rows[rows.length - 1].__cursor; 
    }
    console.log('response bacK: ', { rows, pageInfo});
    return { rows, pageInfo };
  }
)};
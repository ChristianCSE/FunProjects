
import {
  GraphQLInterfaceType, 
  GraphQLObjectType, 
  GraphQLID, 
  GraphQLString, 
  GraphQLNonNull, 
  GraphQLList
} from 'graphql';

//REMEMBER that * is usally bad practice to use!
import * as tables from './tables';
import * as loaders from './loaders';
import { promises } from 'fs';

export const NodeInterface = new GraphQLInterfaceType({
  name: 'Node', 
  fields: {
    /**NOTE: id field doesn't have resolve fxn
    fields in interfaces aren't expected to have default implementaion of resolve
    NOTE: Instead, each obj type that implements Node should define 
    its own reolve*/
    id: {
      type: new GraphQLNonNull(GraphQLID)
    }
  },
    /**NOTE: our-top level node(id:) doesn't guarentee which 
     specific type will be returned, we need to inform concrete type for a particular object
    */
    resolveType: (source) => {
     if(source.__tableName === tables.users.getName()) return UserType; 
     return PostType; 
   }
});

const resolveId = (source) => {
  return tables.dbIdToNodeId(source.id, source.__tableName);
}

//this is used in our GraphQL "query" when we put 
// ... on User (which comes from our name!)
export const UserType = new GraphQLObjectType({
  name: 'User', 
  interfaces: [ NodeInterface ],
  fields: () => {
    return {
      id: {
        type: new GraphQLNonNull(GraphQLId), 
        //note it's calling the fxn above
        resolve: resolveId
      }, 
      name: { type: new GraphQLNonNull(GraphQLString) },
      about: { type: new GraphQLNonNull(GraphQLString) },
      friends: {
        //NOTE: we made this have friends that are list type and the items 
        //inside our list are UserType which are an GraphQLObjectType that we defined
        type: new GraphQLList(UserType), 
        resolve(source) {
          //source comes from ...
          return loaders.getFriendIdsForUser(source)
          .then(
            (row) => {
              const friendNodeId = tables.dbIdToNodeId(row.user_id_b, row.__tableName);
              return loaders.getNodeById(friendNodeId);
            }
          )
          return Promise.all(promises);
        }

      }
    }
  }
  //fields can be a funtion or just straight object defined!
  /**
  fields: {
    id: {
      type: new GraphQLNonNull(GraphQLID),
      resolve: resolveId
    },
    name: {
      type: new GraphQLNonNull(GraphQLString)
    }, 
    about: {
      type: new GraphQLNonNull(GraphQLString)
    }, 
    friends: { 
      //NOTE: we define the graph ql object type, it's an acutal DS type
      //rather than just being not null
      type: new GraphQLList(GraphQLID),
      resolve(source){
        console.log('have source here: ', source);
        // return loaders.getFriendIdsForUser(source)
        // .then((rows)=>{
          
        //   return rows.map(
        //     (row)=>{
        //       return tables.dbIdToNodeId(row.user_id_b, row.__tableName);
        //     })
        // })

        //rather than making two separate queries we make one
        //our object contains friends
        if(source.__friends) {
          return source.__friends.map(
            (row) => tables.dbIdToNodeId(row.user_id_b, row.__tableName)
          );
        }
        //our object does not have any friends; hence, call loader fxn
        return loaders.getFriendIdsForUser(source)
        .then(
          (rows) => rows.map(
            (row) => tables.dbIdToNodeId(row.user_id_b, row.__tableName)
          )
        );

      }
    }
  }
  */
})

export const PostType = new GraphQLObjectType({
  name: 'Post', 
  interfaces: [ NodeInterface ], 
  fields: {
    id: {
      type: new GraphQLNonNull(GraphQLID), 
      resolve: resolveId
    }, 
    createdAt: {
      type: new GraphQLNonNull(GraphQLString)
    }, 
    body: {
      type: new GraphQLNonNull(GraphQLString)
    }
  }
})
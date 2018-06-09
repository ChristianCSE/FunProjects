
//these are the types that the user can query!
import {
  GraphQLInterfaceType, 
  GraphQLObjectType, 
  GraphQLID, 
  GraphQLString, 
  GraphQLNonNull, 
  GraphQLList, 
  GraphQLBoolean, 
  GraphQLInt
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
  //NOTE: WHY IS THIS A FUNCTION? 
  //This is a fxn due to the Js variable hoisting works
  //Look at field for friends, it's a recursive type definition (we are the type)
  fields: () => {
    return {
      id: {
        type: new GraphQLNonNull(GraphQLID), 
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
            (rows) => {
              const promises = rows.map(
                (row) => {
                  const friendNodeId = tables.dbIdToNodeId(row.user_id_b, row.__tableName);
                  return loaders.getNodeById(friendNodeId);
              }); //promises
              console.log('at least made it here: ', promises);
              return Promise.all(promises);
          })
        }
      },
      posts: {
        //new field for our UserType GraphQL Object
        type: PostsConnectionType, 
        args: {
          //?
          after: {
            type: GraphQLString
          }, 
          //>
          first: {
            type: GraphQLInt
          }
        }, 
        resolve(source, args) {
          return loaders.getPostIdsForUser(source, args)
          .then(({ rows, pageInfo}) => {
            console.log('UserType, response back: ', { rows, pageInfo });
            //fetched posts from user in db
            //iterating through individual entry 
            //I'm unsure where it gets wrapped in a promise ... ? 
            const promises = rows.map(
              (row) => {
                const postNodeId = tables.dbIdToNodeId(row.id, row.__tableName);
                console.log('postNodeId: ', postNodeId);
                //fetch the actual post? 
                return loaders.getNodeById(postNodeId)
                .then( 
                  (node) => {
                    console.log("node: ", node);
                    const edge = {
                      node, 
                      cursor: row.__cursor
                    };
                    return edge;
                  }
                )
              }
            );
            //wait for all promises to be resolved until moving on
            return Promise.all(promises)
            .then((edges) => {
              return { edges, pageInfo };
            });

          })
        }
      }
    }
  }
})
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


//NOTE: While there aren't any resolve fxn in some of 
// these attributes, don't think you should avoid them all together

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
});

//
const PageInfoType = new GraphQLObjectType({
  name: 'PageInfo', 
  fields: {
    hasNextPage: {
      type: new GraphQLNonNull(GraphQLBoolean)
    }, 
    hasPreviousPage: {
      type: new GraphQLNonNull(GraphQLBoolean)
    }, 
    startCursor: {
      type: GraphQLString
    }, 
    endCursor: {
      type: GraphQLString
    }
  }
});

const PostEdgeType = new GraphQLObjectType({
  name: 'PostEdge', 
  fields: () => {
    return {
      cursor: {
        type: new GraphQLNonNull(GraphQLString)
      }, 
      node: {
        type: new GraphQLNonNull(PostType)
      }
    }
  }
});

const PostsConnectionType = new GraphQLObjectType({
  name: 'PostsConnection', 
  fields: {
    pageInfo: {
      type: new GraphQLNonNull(PageInfoType)
    }, 
    edges: {
      type: new GraphQLList(PostEdgeType)
    }
  }
});
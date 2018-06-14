

import {
  GraphQLInterface, 
  GraphQLObjectType, 
  GraphQLID, 
  GraphQLString, 
  GraphQLString, 
  GraphQLNonNull, 
  GraphQLList, 
  GraphQLInt
} from 'graphql';

import * as tables from '../db/tables';
import * as loaders from '../loaders/loaders';

import {
  connectionDefinitions
} from 'graphql-relay';

const resolveId = (source) => tables.dbIdToNodeId(source.id, source.__tableName);

export const NodeInterface = new GraphQLInterfaceType({
  name: 'Node', 
  //NOTE: Only enforecd attribute is an ID!
  fields: { id: { type: new GraphQLNonNull(GraphQLID) }, }, 
  resolveType: (source) => {
    if(source.__tableName === tables.users.getName()) return UserType; 
    return PostType; 
  }
})

export const UserType = new GraphQLObjectType({
  name: 'User', 
  interfaces: [ NodeInterface ], 
  fields: () => {
    return {
      id: { 
        type: new GraphQLNonNull(GraphQLID),
        resolve: resolveId
      }, 
      name: {type: new GraphQLNonNull(GraphQLString) },
      about: { type: new GraphQLNonNull(GraphQLString) },
      friends: {
        type: new GraphQLList(UserType), 
        resolve(source) {
          console.log('\n UserType.friends.resolve(source) \n');
          return loaders.getFriendIdsForUser(source)
          .then((rows)=>{
            //invoking multiple queries 
            //(more than likely will not be finished by the time we finished looping through them)
            const promises = rows.map((row) => {
              const fieldNodeId = tables.dbIdToNodeId(row.user_id_b, row.__tableName);
              return loaders.getNodeById(friendNodeId);//it becomes a promise here
            });
            return Promise.all(promises);
          })
        }
      },
      posts: {
        type: PostsConnectionType, 
        args: {
          after: { type: GraphQLString },
          first: { type: GraphQLInt }
        }, 
        resolve(source, args, context) {
          console.debug('\n UserType.posts.resolve() \n');
          return loaders.getPostIdsForUser(source, args, context)
          .then(({rows, pageInfo})=>{
            console.debug('\n Retrieved all user posts \n');
            const promises = rows.map((row)=>{
              //this is due to graphQLs requirement of globally unique keys
              const postNodeId = tables.dbIdToNodeId(row.id, row.__tableName);
              return loaders.getNodeById(postNodeId)
              .then((node)=>{
                const edge = {node, cursor: row.__cursor};
                return edge;
              })
            });//promises
            return Promise.all(promises)
            .then((edges) => {edges, pageInfo})
            .catch((err) => {
              console.error('UserType.posts.error(): ', err);
              return null;
            })
          })
        }
      } //posts
    }//return
  }//fields
})

export const PostType = new GraphQLObjectType({
  name: 'Post', 
  interfaces: [ NodeInterface ], 
  fields: {
    id: {
      type: new GraphQLNonNull(GraphQLID), 
      resolve: resolveId
    }, 
    createdAt: { type: new GraphQLNonNull(GraphQLString) },
    body: { type: new GraphQLNonNull(GraphQLString) }
  }
});

//look at previous layout, oldTypes.js
const { connectionType: PostsConnectionType } = connectionDefinitions({nodeType: PostType});
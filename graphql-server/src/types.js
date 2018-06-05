
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

export const UserType = new GraphQLObjectType({
  name: 'User', 
  interfaces: [ NodeInterface ],
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
        return loaders.getFriendIdsForUser(source
        ).then((rows)=>{
          return rows.map(
            (row)=>{
              return tables.dbIdToNodeId(row.user_id_b, row,__tableName);
            })
        })
      }
    }
  }
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
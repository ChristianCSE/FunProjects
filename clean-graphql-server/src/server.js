//rewrite to track what it's actually doing 

console.log({ starting: true });

import express from 'express';
import basicAuth from 'basic-auth-connect';
//Ensures HTTP req & res are correctly formatted in GraphQL 
import graphqlHTTP from 'express-graphql';

//GraphQL is a "statically" typed
import {
  GraphQLSchema, 
  GraphQLObjectType, 
  GraphQLString, 
  GraphQLNonNull, 
  GraphQLID, 
  GraphQLEnumType
} from 'graphql';

//These are Data Types made by me
import {
  NodeInterface, 
  UserType, 
  PostType
} from './graphql-ds/types';

import * as loaders from './loaders/loaders';

const app = express(); 

console.debug = (...args) => {
  console.log(...args);
}

const RootQuery = new GraphQLObjectType({
  name: 'RootQuery', 
  description: 'Desc is optional', 
  fields: {
    viewer: {
      type: NodeInterface, 
      resolve(source, args, context){
        //differntiate the passing of all three!
        return loaders.getNodeById(context);
      }
    },
    node: {
      type: NodeInterface, 
      args: {
        id: { type: new GraphQLNonNull(GraphQLID) }
      }, 
      resolve(source, args, context, info) {
        return loaders.getNodeById(args.id);
      }
    }
  }
});

const LevelEnum = new GraphQLEnumType({
  name: 'PrivacyLevel', 
  values: {
    PUBLIC: { value: 'public' }, 
    ACQUAINTANCE: { value: 'acquaintance' }, 
    FRIEND: { value: 'friends' }, 
    TOP: { value: 'top' }
  }
});



let inMemoryStore = {};

const RootMutation = new GraphQLObjectType({
  name: 'RootMutation', 
  description: 'Root mutation', 
  fields: {
    setNode: {
      type: GraphQLString, 
      args: {
        id: { type: new GraphQLNonNull(GraphQLID) }, 
        value: { type: new GraphQLNonNull(GraphQLString) }
      }, 
      resolve(source, args) {
        inMemoryStore[args.key] = args.value; 
        return inMemoryStore[args.key];
      }
    }, 
    createPost: {
      type: PostType, 
      args: {
        body: { type: new GraphQLNonNull(GraphQLString) },
        level: { type: new GraphQLNonNull(LevelEnum) }
      }, 
      resolve(source, args, context) {
        return loaders.createPost(args.body, args.level, context)
        .then(loaders.getNodeById);
      }
    }
  }
});


const Schema = new GraphQLSchema({
  types: [UserType, PostType], 
  query: RootQuery, 
  mutation: RootMutation
});


app.use( basicAuth(( user, pass)=> (pass==='mypassword1') ) );

app.use('/graphql', graphqlHTTP( (req) => {
  const context = 'users:' + req.user;
  return {schema: Schema, graphiql: true, context, pretty: true};
  })
);

app.listen(3000, ()=> { console.log({running: true}); });


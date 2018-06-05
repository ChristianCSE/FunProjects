console.log({ starting: true });

import express from 'express';

const app = express(); 

//Ensures that HTTP req & res are correctly formatted for GraphQL
import graphqlHTTP from 'express-graphql';

//exposes APIs that let us construct our schema, and 
// then exposses an API for resolving raw GraphQL doc strings against that schema
import { 
  GraphQLSchema, GraphQLObjectType, GraphQLString,
  GraphQLNonNull, GraphQLID 
} from 'graphql';

import {
  NodeInterface, 
  UserType,
  PostType
} from './src/types';

import * as loaders from './src/loaders';


//GraphQLObjectType: analogous to creating a new class, 
//name is required, descrip isn't necessary but is encouraged.
//name sets the type name in the GraphQL schema
// const RootQuery = new GraphQLObjectType({
//   name: 'RootQuery', 
//   description: 'The root query', 
//   fields: {
//     viewer: {
//       type: GraphQLString, 
//       resolve() {
//         return 'viewer!';
//       }
//     }, 
//     //we've added a node field to our query
//     node: {
//       type: GraphQLString, 
//       args: {
//         id: {
//           type: new GraphQLNonNull(GraphQLID)
//         }
//       }, 
//       resolve(source, args) {
//         return inMemoryStore[args.key];
//       }
//     }
//   }
// });

const RootQuery = new GraphQLObjectType({
  name: 'RootQuery', 
  description: 'The root query [descr is optional]',
  fields: {
    node: {
      type: NodeInterface, 
      args: {
        id: {
          type: new GraphQLNonNull(GraphQLID)
        }
      },
      resolve(source, args) {
        return loaders.getNodeById(args.id);
      }
    } //node
  } //fields
});

let inMemoryStore = {};
const RootMutation = new GraphQLObjectType({
  name: 'RootMutation', 
  description: 'The root mutation', 
  fields: {
    //?
    setNode: {
      //resolve() must return a string 
      //due to type = string! 
      type: GraphQLString,
      //? 
      args: {
        id: {
          type: new GraphQLNonNull(GraphQLID)
        }, 
        value: {
          type: new GraphQLNonNull(GraphQLString) 
        }
      }, 
      //?
      resolve(source, args) {
        inMemoryStore[args.key] = args.value;
        //we return a string in order to coperate with type: GraphQLString
        return inMemoryStore[args.key];
      }
    }
  }
})


// const Schema = new GraphQLSchema({
//   query: RootQuery, 
//   mutation: RootMutation
// });

const Schema = new GraphQLSchema({
  types: [UserType, PostType],
  query: RootQuery, 
  mutation: RootMutation
});

//simply adding the field graphiql: true
//will grant us graphiql ui on the route /graphql 
app.use('/graphql', graphqlHTTP({ schema: Schema, graphiql: true }));

// app.use('/graphql', (req, res) => {
//   res.send({ data: true });
// });

app.listen(3000, () => {
  console.log({ running: true });
})
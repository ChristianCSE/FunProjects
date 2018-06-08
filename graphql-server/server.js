
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

//we enter this first when we make our graphql request? 

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
      resolve(source, args, context, info) {
        // console.log('At least inside RootQuery');
        //we are focusing on returning User types!
        return loaders.getNodeById(args.id);
        /** 
        //Below is for performance
        //NOTE: contex = used with authentication & authorization 
        //NOTE: info = bag of objects including an abstract syntax tree (AST)
        //
        console.log(source);
        console.log(args); //id inside the graphql request
        //node(id:"users:4") <= id:"users:id" is part of our args
        let includeFriends = false; 
        
        //AST optimization, these are look-ahead optimizatios
        //console.log() to view each level of the tree 
        //NOTE: We look for User fragmnets on the node field's selection set
        //we determine if the fragment accesses the friends field
        //if it does => run new loader else run same loader
        console.log('looking into info: ', info);
        console.log('looking into fieldsASTs[0]: ', info.fieldASTs[0]);

        const selectionFragments = info.fieldASTs[0].selectionSet.selections; 
        const userSelections = selectionFragments.filter(
          (selection) => {
            
            return (selection.kind === 'InlineFragment' && 
            selection.typeCondition.name.value === 'User');
          }
        );

        userSelections.forEach(
          (selection) => {
            selection.selectionSet.selections.forEach(
              (innerSelection) => {
                //if the "graph ql entry contians friends"
                //that means we will need to retrieve them
                if (innerSelection.name.value === 'friends') {
                  includeFriends = true;
                }
              }
            )
          }
        )

        if (includeFriends) return loaders.getUserNodeWithFriends(args.id);
        else return loaders.getNodeById(args.id); 

        return loaders.getNodeById(args.id);
        */
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
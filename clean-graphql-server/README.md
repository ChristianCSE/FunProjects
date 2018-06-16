


# Setup 

```js
const Schema = new GraphQLSchema({
  types: [UserType, PostType], //GraphQLObjectType
  query: RootQuery, //all "queries" go through this
  mutation: RootMutation //inserts
})
```

You need to construct each. The generic template is below

```js
const RootQuery = new GraphQLObjectType({
 name: 'name_we_refer_to_in_graphql', 
 description: '[optional]', 
 //we are essentially defining the fields/attributes that are
 //accessible in this G-object
 fields: {
  attribute_name: {
     type: 'some_graphql_object_type', 
     args: { 
      name_of_allowed_arg: { type: new GraphQLNonNull(GraphQLID) },
      //NOTE: banning null is optional!
      another_arg: { type: new GraphQLString } 
     },
     // we only enforce a resolve fxn if you want to 
     // treat a request in a particular way 
     resolve(source, args, context) {
      return thing;
     }
  }, 
  another_attribute: {
   type: 'some_other_graphql_object', 
   //resolve is opitional
  }
 }
});
```
Below is what it would look like: 

```js
import { GraphQLSchemam NodeInterface } from 'graphql';
const RootQuery = new GraphQLObjectType({
 name: 'RootQuery', 
 description: 'Description is optional!', 
 fields: {
  viewer: {
   type: NodeInterface, 
   resolve(source, args, context) {
    return loaders.getNodeById(context);
   }
  },
  node: {
   //define the type of the field itself
   type: NodeInterface, 
   //define what the input into this type is 
   args: { id: { type: new GraphQLNonNUll(GraphQLID)} }, 
   resolve(source, args, context, info) {
    return loaders.getNodeById(args.id); 
   }
  }
 }
})
```
NOTE: The resolve() fxn is optional. If one is not specified, then the default resolver is used, which looks for a method on source of the same name as the field.

The object constructed above allows for one to make a graphql request: 
```graphql
#const Schema = new GraphQLSchema({query: RootQuery})
#makes it so this is header of our request
{ 
  node(id:"users:4") {
  
  }
}
```

The rest of the objects that handle the requests 
```js
import {GraphQLObjectType, } from 'graphql';

export const UserType = new GraphQLObjectType({
 name: 'User', 
 interfaces: [ NodeInterface ],
 //NOTE: Fields is a FUNCTION
 //This is usually used to make circular references (closure/thunk; providing things lazily)
 fields: () => {
  return {
   id: { type: new GraphQLNonNull(GraphQLID) },
   friends: {
    type: new GraphQLList(UserType), //self-reference! => what's returned? 
    resolve(source) {
     //do stuff and treat repsonse! 
    }
   }, 
   posts: {
    type: PostsConnectionType, //NOTE: refers to some relay object
    args: {
     after: { type: GraphQLString }, 
     first: { type: GraphQLInt}
    }
   }
  }
 }
})

//relay
import { connectionDefinitions } from 'graphql-relay';
const { connectionType: PostsConnectionType } = connectionDefinitions({nodeType: PostType})
```


We also need mutations for allowing POSTs. Note that in our defined schema we reffered to `mutation: RootMutation`
```js
const RootMutation = new GraphQLObjectType({
 name: 'RootMutation', 
 description: 'Used for inserts', 
 fields: {
  setNode: {
   type: GraphQLString, 
   args: { type: new GraphQLNonNull(GraphQLID)}
  }, 
  createPost: {
   type: PostType, //NOTE: this is a GraphQLObjectType we made
   args: {
    body: { type: new GraphQLNonNull(GraphQLString) },
    level: { type: new GraphQLNonNull(LevelEnum)}, 
    resolve(source, args, context) {
     return;
    }
   }
  }
 }
})
```
With this in our schema we make insertion request with the following syntax: 
```graphql
mutation {
 createPost(body:"First post!", level:PUBLIC) {
  id 
  body
 }
}
```
which is akin to 
```graphql
mutation {
 setMutation(...args) {
  desired_attrb_1
  desired_attrb_2
 }
}
```


# Incorporating Express 

Lastly, in order to connect this to express along with some sort of 
authentication we just do: 

```js
import basicAuth from 'basic-auth-connect';
import graphqlHTTP from 'express-graphql';
import express from 'express';
const app = express();
//realistically you would make a db request and see if the user entered the 
//matching db password! (remember that use is our middleware)
app.use( basicAuth((user, pass) => (pass==='mypassword1') )); 

//set graphql route 
app.use('/graphql', graphqlHTTP( (req) => {
 const context = 'users:' + req.user;
 return {
  shcema: Schema, 
  graphql: true, 
  context, 
  pretty: true
 };
}))

//set port 
app.listen(3000, () => { console.log({running: true}); });
```








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
   type: NodeInterface, 
   args: { id: { type: new GraphQLNonNUll(GraphQLID)} }, 
   resolve(source, args, context, info) {
    return loaders.getNodeById(args.id); 
   }
  }
 }
})
```

The object constructed above allows for one to make a graphql request: 
```graphql
//const Schema = new GraphQLSchema({query: RootQuery})
//makes it so this is header of our request
{ 
  node(id:"users:4") {
  
  }
}
```




# basic read
```graphql
{
  node(id:"users:2") {
    ... on User {
      posts{
        edges{
          node {
            id 
            ... on Post {
              body
            }
          }
        }
      }
    }
  }
}
```

and we have 

```js
  const Schema = new GraphQLSchema({
    types: [UserType, PostType], 
    query: RootQuery, 
    mutation: RootMutation 
  })
```

so it first goes to RootQuery and goes to it's node field. 
(we are passing an arg to it too!)
We are sending our arg to the resolve function of 
`RootQuery.fields.node.resolve`

```js
  resolve(source, args, context, info) {
    return loaders.getNodeById(args.id);
  }
```

`loaders.getNodeById(args.id)` returns the node id of the user. 
the `... on User` makes it so the returned db entry is passed to 
`UserType.fields.posts.resolve`. NOTE: we receive the input from `source`.

```js 
  resolve(source) {
    return loaders.getFriendIdsForUser(source)
    .then((rows)=> /*more code...*/)
  }
```

Lastly, we go to `... on Post`.
(Note: the names of these datatypes are inside the name field of 
each GraphQLObjectType!). This, unlike the previous graphql objects does
not have a resolve function!



# insert (aka Mutation)

```graphql
mutation {
  createPost(body:"First post!", level:PUBLIC){
    id 
    body 
  }
}
```
so we set up schema in 'server.js'
```js
const Schema = new GraphQLSchema({
  types: [UserType, PostType], 
  query: RootQuery, 
  mutation: RootMutation 
})
```
Note that mutation is set to our `GraphQLObjectType` called `RootMutation`


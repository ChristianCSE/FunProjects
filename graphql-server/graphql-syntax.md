

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
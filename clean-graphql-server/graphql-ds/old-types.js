
/**
 * This implementation is in the absence of graph-relay (no access to connectionDefinition)
*/



const resolveId = (source) => tables.dbIdToNodeId(source.id, source.__tableName);

export const PostType = new GraphQLObjectType({
  name: 'Post', 
  interfaces: [NodeInterface], 
  fields: {
    id: {
      type: new GraphNonNull(GraphQLString), 
      resolve: resolveId
    }, 
    createdAt: { type: new GraphQLNonNull(GraphQLString) },
    body: { type: new GraphQLNonNull(GraphQLString) }
  }
})

const PageInfoType = new GraphQLObjectType({
  fields: {
    hasNextPage: { type: new GraphQLNonNull(GraphQLBoolean) },
    hasPreviousPage: { type: new GraphQLNonUll(GrpahQLBoolean) },
    startCursor: { type: GraphQLString },
    endCursor: { type: GraphQLString }
  }
})

const PostEdge = new GraphQLObjectType({
  name: 'PostEdge', 
  fields: () => {
    return {
      cursor: { type: new GraphQLNonNull(GraphQLString) },
      node: { type: new GraphQLNonNull(PostType) }
    }
  }
})

const PostsConnectionType = new GraphQLObjectType({
  name: 'PostsConnection',
  fields: {
    pageInfo: { type: new GraphQLNonNull(PageInfoType) },
    edges: { type: new GraphQLList(PostEdgeType) }
  }
})
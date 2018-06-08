const findNode = (id) => {
    const [prefix, dbId] = id.split(":");
    if (prefix === 'users') return dbId.usersTable.find(dbId);
    else return null;
};

const getUser(id) => {
    let user = db.userTable.find(id);
    user.id = `users:${user.id}`;
    return user;
};

/* 
GraphQL: IDs are strings 
This allows for readable changes 
Querying nodes using node(id:) field =
easier for apps to refresh stale data w/o having to track of where 
a piece of data comes from in the schema. 
*/


/* Viewer
 Def: The current user & connections to that user. 
Graph Connections & Edges 
CONNECTIONS to sets of other NODES (messages & channels)
Cursor-based pagination
GraphQL: request pass cursors to specify location in the list to load net. 

*/

const graphQLQry = ` {
    hn2 {
        //our initial node retrives the node for Drew Houston (user)
        //our connection has 2 fields = pageInfo & edges
        nodeFromHn(id:"dhouson", idUserId:true){
            ... on HackerNewsV2 {
                submitted(first: 2) {
                    //this is metdata on the moving window than just the page 
                    //this provides detail for when you should allow/make requests
                    //for more info!
                    pageInfo {
                        hasNextPage
                        hasPreviousPage
                        startCursor
                        endCursor
                    }
                    //this is a list of actual nodes! 
                    edges {
                        //node id & cursor are 2 separete fields 

                        cursor 
                        node {
                            id
                            ... on HackerNewsV2Comment {
                                text
                            }
                        }
                    }
                }
            }
        }
    }
}`;




/*
So say after making this query you receive this output
*/
/*
{
	"nodeFromHnId": {
		"submitted": {
			"pageInfo": {
				"hasNextPage": true,
				"hasPreviousPage": false,
				"startCursor": "YXJyYXljb25uZWN0aW9uOjE=",
				"endCursor": "YXJyYXljb25uZWN0aW9uOjI="
			},
			"edges": [{
				"cursor": "YXJyYXljb25uZWN0aW9uOjE=",
				"node": {
					"id": "aXRlbTo1MzgxNjk0",
					"text": "it's not going anywhere :)"
				}
			}, {
				"cursor": "YXJyYXljb25uZWN0aW9uOjI=",
				"node": {
					"id": "aXRlbTo0NjgxMzY2",
					"text": "yes we are :)"
				}
			}]
		}

	}
}
*/

/*
NOTE: startCursor & endCursor 
NOTE: that in our edges array we have both the startCursor & endCursor 
We could use that cursor to fetch the next set of data using the 
after argument!
*/

/*
{
	hn2 {
		nodeFromHnId(id: "dhouston", isUserId: true) {
			...on HackerNewsV2User {
                //NOTE: We are using the after argument 
                //along with the 
				submitted(first: 2, after: "YXJyYXljb25uZWN0aW9uOjI=") {
					pageInfo {
						hasNextPage hasPreviousPage startCursor endCursor
					}
					edges {
						cursor node {
							id
								...on HackerNewsV2Comment {
									text
								}
						}
					}
				}
			}
		}
	}
}
*/




//MUTATIONS 
/*
This is a mutation to edit an in-memory key value store: 

mutation {
    keyValue_setValue(input: {
        clientMutationId: "browser", id: "this-is-a-key", value: "this is a value"
    }) {
        item {
            value
            id
        }
    }
}

mutation field = keyValue_setValue
takes an input arg that gives info what key & value to set. 
We also get to pick & choose the fields returned by the mutation 
=> item 
this is the sort of payload you'd get: 
{
    "data": {
        "keyValue_setValue": {
            "item": {
                "value": "some val",
                "id": "somekey"
            }
        }
    }
}

*/

//SUBSCRIPTIONS
/*
Real-time updates seen in apps like twtr & fb
will update without requiring the user to manually refresh. 
*/

//graphql syntax
/*
input StoryLikeSubscribeInput {
    storyId: string 
    clientSubscriptionId: string
}

subscription StoryLikeSubscription($input: StoryLikeSubscribeInput){
    storyLikeSubscribe(input: $input) {
        story {
            likers { count }
            likeSentence { text }
        }
    }
}
*/

/*
The above is saying that whenever a StoryLikeSubscription occurs 
that it wants that particular data. Along with its request, it sends 
its clientSubscriptionId. 
subscription operation type = acceptable
defers each app on how to handle real-time updates.
*/

//dummy example [not real code]


let clientSubscriptionId = generateSubscriptionId(); 
//this channel could be Websockets, MQTT, etc.
connectToRealtimeChannel(clientSubscriptionId, (newData) => {});
//send GraphQL requests to tell the server to start sending updates 
sendGraphQLSubscription(clientSubscriptionId);




//example of making a graphql request


let query = ' { graphQLHub } ';
let options = {
    method: 'POST', 
    body: query, 
    headers: {
        'content-type': 'application/graphql'
    }
};

fetch('https://graphqlhub.com/graphql', options)
.then((res)=> {
    return res.json();
}).then((data) => {
    console.log(JSON.stringify(data, null, 2));
})

//Relay & Apollo 
//Relay: automates many of the best practices for 
//react/graphql apps: caching, cache-bustring, and batching.
/*
if using Redux, you can probs swap REST or other API calls
with GraphQL calls using fetch techn. 
You won't get the colocated queries API that Relay or others
provide, but it uses Redux under the hood to store GraphQL 
cache & data. 
*/


//example of Apollo 
class AboutGraphQLHub extends React.Component {
    render(){
        return <div> {this.props.about.graphQLHub} </div>;
    }
}

const mapQueriesToProps = () => {
    return {
        about: {
            query: '{ graphQLHub }'
        }
    }
}

const ConnectedAboutGraphQLHub = connect({
    mapQueriesToProps
})(AboutGraphQLHub) 









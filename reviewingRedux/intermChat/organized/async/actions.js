
//for async in Redux, we need Redux Thunk middleware
//this specific middleware, an action creator can return a
//fxn rather than an action object

//our action creator becomes a thunk
//a subroutine used to inject an additional calculation into another 
//subroutine. Thunks are primarily used to delay a calculation until its result is needed


//action creator returns a fxn, which will be executed by 
//the Redux Thunk middleware
//fxn need not be pure, can have side-effects (which include async API calls)
//can also dispatch actions 

import fetch from 'cross-fetch';

export const REQUEST_POSTS = 'REQUEST_POSTS';
const requestPosts = (subreddit) => {
  return {
    type: REQUEST_POSTS, 
    subreddit
  };
};

export const RECEIVE_POSTS = 'RECEIVE_POSTS';
const receivePosts = (subreddit, json) => {
  return {
    type: RECEIVE_POSTS, 
    subreddit, 
    posts: json.data.children.map(child => child.data),
    receivedAt: Date.now()
  };
};

export const INVALIDATE_SUBREDDIT = 'INVALIDATE_SUBREDDIT';
export function invalidateSubreddit = (subreddit) => {
  return {
    type: INVALIDATE_SUBREDDIT, 
    subreddit
  };
};

//thunk passes the dispatch method as an arg to the function,
//making it able to dispatch actions itself
export const fetchPosts = (subreddit) => {
  return (dispatch) => {
    //the app state is updated to inform that the API call is starting
    dispatch(requestPosts(subreddit))
    //fxn called by thunk middleware can return a val that's passed on as the 
    return fetch(`https://www.reddit.com/r/${subreddit}.json`)
    .then(response => response.json, 
      //instructed not to ues catch due to 'Unexpected batch number' error
      error => console.log('An error occurred.', error)
    ).then(json => dispatch(receivePosts(subreddit, json)));
    //we can dispatch many times!
  }
};

//NOTE: fetch polyfill assumes a Promise polyfill is already present. 
//enable Babel's ES6 polyfill to ensure Promise polyfill is enabled
//import 'babel-polyfill'
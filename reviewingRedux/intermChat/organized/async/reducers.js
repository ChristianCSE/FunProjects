



import { combineReducers } from 'redux';
import { INVALIDATE_SUBREDDIT, REQUEST_POSTS, RECEIVE_POSTS } from './actions';


const posts = (state = {
    isFetching: false, 
    didInvalidate: false, 
    items: []
  }, action) => {
  switch(action.type){
    case INVALIDATE_SUBREDDIT: 
      return Object.assign({}, state, {didInvalidate: true});
    case REQUEST_POSTS: 
      return Object.assign({}, state, {
        isFetching: true, didInvalidate: false
      });
    case RECEIVE_POSTS:
      return Object.assign({}, state, {
        isFetching: false, didInvalidate: false, 
        items: action.posts, lastUpdate: action.receivedAt
      });
    default: 
      return state;
  }
};

//const rootReducer = combineReducers({})
//export defualt rootReducer
/*
return Object.assign({}, state, {
  [action.subreddit] : posts(state[action.subreddit], action)
});

//equivalent to this 
let nextState = {}; 
nextState[action.subreddit] = posts(state[action.subreddit], action);
return Object.assign({}, state, nextState);
*/

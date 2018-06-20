
# General 

## Structure
`/actions`
```jsx
import axios from 'axios'; 
import { BASE_URL } from '../constants/backendURL.js';

const ACTION_TYPE = 'ACTION_TYPE';

const API_ENDPOINT = `${BASE_URL}/api/getting`;

const ACTION_CREATOR = (data) => {
 return { type: ACTION_TYPE, data };
};

export const dispatchAction = (input=' ', misc=' ') {
 if(input === ' ' && misc === ' ') return null;
 const params = `${input}/${misc}`; 
 const endpoint = `${API_ENDPOINT}/${params}`;
 return (dispatch) => {
  return axios.get(`${endpoint}`)
  .then({ data } => {
   dispatch(ACTION_CREATOR(data))
  }).catch((err) => {
   console.error('ERROR dispatchAction: ', err);
   return; 
  })
 }
}

```

`/components`

`/containers`

`/reducers`
Reducers take `action creators` and read the `action type` and act accordingly. Below is a generic reducer.
```
//These are the accepted action types
//it's probably better to keep track of them in a file of constants 
const {
 X_CREATE_ACTION_TYPE, 
 X_DELETE_ACTION_TYPE,
 X_UPDATE_ACTION_TYPE
} from 'const/remover';

//TODO: make sure that [...state, 'something'] is actually creating a new //array (need to maintain immutability)
export const x_reducer = (state=[], payload) => {
 switch(payload.type) {
  case X_CREATE_ACTION_TYPE: 
   return [...state, 'create'];
  case X_DELETE_ACTION_TYPE: 
   return [...state, 'delete'];
  case X_UPDATE_ACTION_TYPE: 
   return [...state, 'update'];
  default:
   return state;
 }
}

```


`/reducers/index.js`
Unfortunately, we have to send our action creator to all reducers until we find a valid entry. That's due to Redux requiring one reducer.
```jsx
import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';

import { x_reducer } from './x_reducer';
import { y_reducer } from './y_reducer';
import { z_reducer } from './z_reducer';

export const rootReducer = combineReducers({
 x_reducer, 
 y_reducer, 
 z_reducer
});


```


`store.js`
```jsx
import rootReducer from './reducers'; //accesses index.js
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk'; //middleware
import createHistory from 'history/createBrowserHistory';
import { routerMiddleware } from 'react-router-redux'; 

export const history = createHistory();
const middleware = routerMiddleware(history);

export const Store = (initState) => {
 return createStore(rootReducer, initState, applyMiddleware(thunk, middleware));
}


```

`index.js`

```jsx
import React from 'react';
import ReactDOM from 'react-dom';
import { ConnectedRouter } from 'react-router-redux';
import { Provider } from 'react-redux'; //dangerous/experimental feature

import App from './App';
import { Store, history } from './store';


const initStore = Store();
const root = (
 <Provider store={initStore}>
  <ConnectedRouter history={history}>
   <App/>
  </ConnectedRouter>
 </Provider>
);

```


`/constants`
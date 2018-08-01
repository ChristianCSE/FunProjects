import React from 'react';
import ReactDOM from 'react-dom';

import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import createSagaMiddleware from 'redux-saga';


//middleware required to be allowed to dispatch functions 
//rather than just action objects
import thunk from 'redux-thunk';

import rootSaga from './sagas';

//import { devToolsEnhancer } from 'redux-devtools-extension';
import { composeWithDevTools } from 'redux-devtools-extension';

//import tasks from './reducers';
import tasksReducer from './reducers';

import App from './App';

import './index.css';


// Making a ROOTREDUCER in order direct RELEVANT DATA to particular reducers
//NOTE: we accept the current OVERALL STATE, 
//and are sending a sub-state to a particular reducer
const rootReducer = (state = {}, action) => {
  return {
    tasks: tasksReducer(state.tasks, action), 
    //projects: projectReducer(state.projects, action)
  };
};
//the functionality we just did above is what 
//combineReducers 
//from redux does

const sagaMiddleware = createSagaMiddleware();

//const store = createStore(tasks, devToolsEnhancer());
const store = createStore(
  //tasks,
  rootReducer,
  composeWithDevTools( applyMiddleware(thunk, sagaMiddleware) )
);

sagaMiddleware.run(rootSaga); //init the saga with run() on sagaMiddleware



const wrapProvider = (
  <Provider store={store}>
    <App />
  </Provider>
);

//module.hot is exposed in development mode ONLY 
//rerender the component when the App component changes 
//or if any of its children change 
if (module.hot) {
  //module.hot.accept(one or more deps, callback)
  //sending string location of our component that will rerender
  //callback is triggered after the modules have successfully been repalced. 

  module.hot.accept('./App', () => {
    const NextApp = require('./App').default;
    console.log('NextApp: ', NextApp);
    const changes = (
      <Provider store={store}> 
        <NextApp />
      </Provider>
    );
    ReactDOM.render(changes, document.getElementById('root'));
  });


  //reducer & store
  //whenever reducer updates, perform the hot module replacement
  module.hot.accept('./reducers', () => {
    const nextRootReducer = require('./reducers').default;
    store.replaceReducer(nextRootReducer);
  });

}


ReactDOM.render(wrapProvider, document.getElementById('root'));
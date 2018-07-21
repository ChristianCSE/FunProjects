import React from 'react';
import ReactDOM from 'react-dom';

import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';

//import { devToolsEnhancer } from 'redux-devtools-extension';
import { composeWithDevTools } from 'redux-devtools-extension';

import tasks from './reducers';
import App from './App';

import './index.css';

//const store = createStore(tasks, devToolsEnhancer());
const store = createStore(
  tasks,
  composeWithDevTools( applyMiddleware(thunk) )
);

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
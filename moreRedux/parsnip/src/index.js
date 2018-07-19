import React from 'react';
import ReactDOM from 'react-dom';

import { createStore } from 'redux';
import { Provider } from 'react-redux';

import tasks from './reducers';
import App from './App';

import './index.css';

const store = createStore(tasks);

const wrapProvider = (
  <Provider store={store}>
    <App />
  </Provider>
);


ReactDOM.render(wrapProvider, document.getElementById('root'));
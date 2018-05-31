import React from 'react';
import { createStore, combineReducers } from 'redux';
import uuid from 'uuid';

import { Provider, connect } from 'react-redux';



//would be inside reducers/activeThreadIdReducer.js 
function activeThreadIdReducer(state = '1-fca2', action){
  if(action.type === 'OPEN_THREAD') {
    return action.id;
  } else {
    return state; 
  }
}

function threadsReducer(state = [
  {
    id: '1-fca2', 
    title: 'Buzz', 
    messages: messagesReducer(undefined, {})
  }, 
  {
    id: '2-be91', 
    title: 'Mike', 
    messages: messagesReducer(undefined, {})
  }
], action) {
  //usually with reducers you use switches 
  switch(action.type) {
    //the way ADD_MESSAGE is setup is so that it uses
    //the DELETE_MESSAGE case 
    case 'ADD_MESSAGE': 
    case 'DELETE_MESSAGE': {
      //findThreadIndex allows us to combine add & delete 
      const threadIndex = findThreadIndex(state, action);
      const oldThread = state[threadIndex];
      //immutability must be maintained
      //we make a new thread with messages changed (wrt to action)
      const newThread = {
        ...oldThread, 
         messages: messagesReducer(oldThread.messages, action)
      };
      return [
        ...state.slice(0, threadIndex), 
        newThread,
        ...state.slice(threadIndex + 1, state.length)
      ];
    } default: {
      //Remember: All action dispatches go through all reducers
      //so if an action is unrelated to this part (leaf) of the 
      //state, then there is no reason to change this substate
      return state;
    }
  }
}

//helper functions
function findThreadIndex(threads, action) {
  switch(action.type) {
    case 'ADD_MESSAGE': {
      //returns the thread object matching the requested id
      return threads.findIndex(
        (a_thread) => a_thread.id === action.threadId
      )
    }
    case 'DELETE_MESSAGE': {
      //returns index of thread (inside of the array) 
      //that returns true on a_thread.messages find
      return threads.findIndex(
        (a_thread) => a_thread.messages.find(
          (msg) => msg.id === action.id
        ) 
      )
    }
  }
}

//helper functions
function messageReducer(state = [], action) {
  switch(action.type) {
    case 'ADD_MESSAGE': {
      const newMessage = {
        text: action.text, 
        timestamp: Date.now(),
        id: uuid.v4()
      };
      //concat makes a new array and appends the msg
      return state.concat(newMessage); 
    }
  }
}

//would be in it's own folder reducers/index.js 
const reducer = combineReducers({
  activeThreadId: activeThreadIdReducer, 
  threads: threadsReducer
});

const store = createStore(reducer);

//this is an action creator we would usually place this in 
//the action folder along with the dispatch method 
function deleteMessage (id) {
  return {
    type: 'DELETE_MESSAGE', 
    id
  };
}

function addMessage(text, id) {
  return {
    type: 'ADD_MESSAGE', 
    text, 
    threadId
  };
}

function openThread(id){
  return {
    type: 'OPEN_THREAD', 
    id
  };
}

//NOTE: Provider now serves as our only reference to the store from 
//our React Components
const WrappedApp = () => {
  <Provider store={store}> 
    <App />
  </Provider> 
};

//NOTE 
//mapStateToProps
//connect(mapStateToProps, mapDispatchToProps)(Component);
//Give access to diff substates! 
//This is how you can access certain substates of the GLOBAL APP STATE



//allows components to access sub-state via: props.tabs 
const mapStateToTabsProps = (state) => {
  const tabs = state.thread.map(
    (a_thread) => ({
      title: a_thread.title,
      active: a_thread.id === state.activeThreadId, 
      id: a_thread.id
    })
  );
  return {
    tabs
  };
}

//action dispatchers receive the same treatment 
//remember that we also abstracted actions into action creators
const mapDispatchToTabsProps = (dispatch) => (
  {
    onClick: (id) => (
      dispatch(openThread(id))
    )
  }
);

const Tabs = (props) => {
  return (
    <div className = 'ui top attached tabular menu'>
    {
      props.tabs.map(
        (tab, index) => 
        <div
          key = { index }
          className = { tab.active ? 'active item' : 'item'}
          onClick = {() => props.onClick(tab.id)}
        >
          {tab.title} 
        </div>
      )
    }
    </div> 
  );
}

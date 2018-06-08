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

//effectively we are passing all our substates & actions 
//to the Tabs Component
/*
From react-redux README
Connects a React component to a Redux store. 
connect is a facade around connectAdvanced, 
providing a convenient API for the most common use cases.
*/
const ThreadTabs = connect(
  mapStateToTabsProps, 
  mapDispatchToTabsProps
)(Tabs); 

class TextFieldSubmit extends React.Component {
  //NOTE: this property belongs to this component 
  //we didn't place this inside the store 
  state = {
    value: ''
  };
  
  //using es6 arrow function binds 'this'; hence, lack 
  //of fxnName.bind(this)
  onChange = (event) => {
    this.setState({
      value: event.target.value
    });
  }


  handleSubmit = () => {
    this.props.onSubmit(this.state.value);
    //causes this entire component to re-render
    this.setState({
      value: ''
    });
  }

  render() {
    return(
      <div className='ui input'> 
        <input 
          onChange={this.onChange} 
          value={this.state.value} 
          type='text'
        />
        <button
          onClick={this.handleSubmit}
          className='ui primary button'
          type='submit'
        >
          Submit 
        </button>
      </div>
    );
  } 
}

const Thread = (props) => (
  <div className = 'ui center aligned basic segment'>
    <MessageList 
      messages = { props.thread.messages }
      onClick = { props.onMessageClick }
    />
    <TextFieldSubmit
      onSubmit = { props.onMessageSubmit }
    />
  </div>
);


const MessageList = (props) => (
  //NOTE: One div wraps all our messages
  // {<jsx stuff>}
  <div className='ui comments'>
    {
      props.messages.map(
        (msg, index) => (
          <div 
            className= 'comment'
            key = {index}
            onClick = {() => props.onClick(msg.id)}
          >
            <div className='text'> {msg.text} 
              <span className='metadata'> @ {msg.timestamp} </span> 
            </div>
          </div>
        )
      )
    }
  </div> 
);

//again we are mapping state to props as the fxn name says
//this time it is related to Thread related state 
const mapStateToThreadProps = (state) => (
  {
    thread: state.threads.find(
      (a_thread) => a_thread.id === state.activeThreadId 
    )
  }
);

const mapDispatchToThreadProps = (dispatch) => (
  {
    onMessageClick: (id) => (
      //dispatch(actionCreator(id))
      //dispatch sends it to our combined reducer and 
      //alters state accordingly to the action type
      dispatch(deleteMessage(id))
    ), 
    dispatch 
  }
);


const mergeThreadProps = (stateProps, dispatchProps) => (
  {  
    ...stateProps, 
    ...dispatchProps, 
    //NOTE: We're grabbing dispatch fxn from dispatchProps
    //NOTE: it's passed from stateProps & we have access to this 
    //due to the fact that connect allows this third method inside it's p
    onMessageSubmit: (text) => (
      dispatchProps.dispatch(addMessage(text, stateProps.thread.id))
    )
  }
)

const ThreadDisplay = connect(
  mapStateToThreadProps, 
  mapDispatchToThreadProps, 
  mergeThreadProps
)(Thread);

//can still do import App from './CleanApp' and still receive WrappedApp as App
export default WrappedApp; 
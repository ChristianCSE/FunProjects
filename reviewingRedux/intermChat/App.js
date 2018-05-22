
//structured 

import React from 'react';
import { createStore, combineReducers } form 'redux';
import uuid from 'uuid';

const reducer =  combineReducers({
  activeThreadId: activeThreadIdReducer, 
  threads: threadsReducer
});


/**
 * []
 * @param  {} state  [description]
 * @param  {} action [description]
 * @return {}        [description]
 */
function activeThreadReducer(state, action) {
  if(action.type === 'OPEN_THREAD') {
    return action.id;
  } else {
    return state; 
  }
}

/**
 * [Retrieve current thread and either add or delete a message from it]
 * @param  {Object}  state  [sub-state: thread]
 * @param  {string} action [holds metadata of action committed by user & input data]
 * @return {Object} [sub-state: thread]
 */
function threadsReducer(state= [
    {
      id: '1-fca2', 
      title: 'Buzz', 
      messages: messagesReducer(undefined, {})
    },
    {
      id: '2-be91',
      title: 'Michael', 
      messages: messagesReducer(undefined, {})
    }
  ], action) {
    switch(action.type){
      case 'ADD_MESSAGE':
      case 'DELETE_MESSAGE': {
        const threadIndex = findThreadIndex(state, action);
        const oldThread = state[threadIndex];
        const newThread = {
          ...oldThread, 
          messages: messagesReducer(oldThread.messages, action)
        };
        return [
          ...state.slice(0, threadIndex),
          newThread, 
          ...state.slice(threadIndex+1, state.length)
        ];
      }
      default: {
        return state; 
      }
    }
}

/**
 * [findThreadIndex description]
 * @param  {[type]} threads [description]
 * @param  {[type]} action  [description]
 * @return {[type]}         [description]
 */
function findThreadIndex(threads, action){
  switch(action.type){
    case 'ADD_MESSAGE':{
      return threads.findIndex(
        (a_thread) => a_thread.id === action.threadId
      );
    }
    case 'DELETE_MESSAGE': {
      return threads.findIndex(
        (a_thread) => a_thread.messages.find(
          (msg) => msg.id === action.id
        )
      );
    }
  }
}

/**
 * [messagesReducer description]
 * @param  {Array}  state  [description]
 * @param  {[type]} action [description]
 * @return {[type]}        [description]
 */
function messagesReducer(state=[], action){
  switch(action.type){
    case 'ADD_MESSAGE': {
      const newMessage = {
        type: action.text, 
        timestamp: Date.now(),
        id: uuid.v4()
      }
      return state.concat(newMessage);
    }
    case 'DELETE_MESSAGE': {
      return state.filter(
        (msg) => msg.id !== action.id
      );
    }
    default: {
      return state;
    }
  }
}


const store = createStore(reducer);

class App extends React.Component {

  /**
   * [automatically subscribe forceUpdate to our store 
   * ;hence, anytime our state is changed, this component will rerender]
   * @return [N/A]
   */
  componentDidMount() {
    store.subscribe( () => this.forceUpdate() );
  }

  render(){
    const state = store.getState();
    const activeThreadId = state.activeThreadId; 
    const threads = state.thread; 

    const activeThread = threads.find((a_thread) => a_thread.id === activeThreadId);

    const tabs = threads.map((a_thread) => (
      {
        title: a_thread.title, 
        active: a_thread.id === activeThreadId,
        id: a_thread.id
      }
    ));
    return(
      <div className="ui segment">
        <ThreadTabs tabs={tabs}/>
        <Thread thread={activeThread} />
      </div>
    );
  }
}


class ThreadTabs extends React.Component {
  handleClick = (id) => {
    store.dispatch({
      type: 'OPEN_THREAD',
      id: id
    });
  };

  render(){
    const tabs = this.props.tabs.map(
      (tab, index) => (
        <div 
          key={index}
          className={tab.active ? 'active item' : 'item'}
          onClick={()=>this.handleClick(tab.id)}
        >
        {tab.title}
        </div>
      )
    );
    return(
      <div className="ui top attatched tabular menu">
        {tabs}
      </div>
    );
  }
}



class MessageInput extends React.Component {
  //NOTE: Local state belonging to this component 
  state = {
    value: ''
  };

  onChange = (event) => {
    this.setState({
      value: event.target.value
    });
  };

  handleSubmit = () => {
    store.dispatch({
      type: 'ADD_MESSAGE',
      text: this.state.value, 
      threadId: this.props.threadId
    });
    //resetting local state
    this.setState({
      value: ''
    });
  }

  render(){
    return(
      <div className="ui input">
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


class Thread extends React.Component {
  handlClick = (id) => {
    store.dispatch({
      type: 'DELETE_MESSAGE',
      id: id
    });
  }

  render(){
    const messages = this.props.thread.messages.map(
      (message, index) => (
        <div 
          className='comment'
          key={index}
          onClick={() => this.handleClick(message.id)}
        >
          <div className='text'>
            {message.text}
            <span className='metadata'> @{message.timestamp} </span>
          </div>
        </div>
      )
    );
    return (
      <div className='ui center aligned basic segment'>
        <div className='ui comments'>
          {messages}
        </div>
        <MessageInput threadId={this.props.thread.id}>
      </div>
    );
  }
}

export default App; 
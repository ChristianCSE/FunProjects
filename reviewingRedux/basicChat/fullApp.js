

import React from 'react';


//Redux Store implementation 

function createStore(reducer, initialState){
  let state = initialState; 
  const listeners = [];
  function getState(){
    return state;
  }
  //NOTE: We go through 1 reducer (in normal redux we combine 
  //all our reducers into a single reducer)
  function dispatch(action){
    state = reducer(state, action);
    //notify all our listeners about the recent state change
    listeners.forEach(subscribed_listener => subscribed_listener());
  }
  /**
   * [Stores a listener function that will be invoked by every call to dispatch]
   * @param  {function} listener [whenever state changes, we will invoke this listener]
   */
  function subscribe(listener){
    listeners.push(listener);
  }
  return {
    subscribe,
    getState, 
    dispatch
  };
}

function reducer(state, action){
  if(action.type === 'ADD_MESSAGE') {
    return {
      messages: state.messages.concat(action.message);
    }
  } else if(action.type === 'DELETE_MESSAGE') {
    return {
      messages: [
        ...state.messages.slice(0, action.index),
        ...state.messages.slice(action.index+1, state.messages.length)
      ]
    };
  } else {
    return state;
  }
}

const initialState = { messages: [] };
const store = createStore(reducer, initialState);

//NOTE: Normally we would not have store in the same file as our components
//NOTE: Apparently not a good idea to call forceUpdate
class App extends React.Component {
  //NOTE: As soon as the component mounts, we subscribe 
  //the built-in forceUpdate React method as a listener; hence
  //, this component will re-render when any change in state occurs
  componentDidMount() {
    store.subscribe(()=> this.forceUpdate());
  }
  render() {
    const messages = store.getState().messages;
    return (  
      <div className='ui segment'>
        <MessageView messages={message} />
        <MessageInput />
      </div>
    );
  }
}


//NOTE: Using ES6 function syntax automatically binds this to 
//the method
class MessageInput extends React.Component {
  //NOTE: This is the input text
  //NOTE: While we can store this in Redux, we are not
  state = {
    value: ''
  }
  
  onChange = (event) => {
    //receives input from form and re-renders due to state change!
    //continually re-renders and updates state!
    this.setState({
      value: event.target.value
    })
  };

  //send action with message payload to the store 
  //will change state and invoke our reducer 
  //reset componetn state too (for new messages)
  handleSubmit = () => {
    store.dispatch({
      type: 'ADD_MESSAGE',
      message: this.state.value
    });
    this.setState({ 
      value: ''
    });
  };

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


class MessageView extends React.Component {
  handleClick = (index) => {
    store.dispatch({
      type: 'DELETE_MESSAGE',
      index: index
    });
  };
  render(){
    //NOTE: implicit return syntax
    const messages = this.props.messages.map((message, index)=>(
      <div 
        className='comment'
        key={index}
        onClick={() => this.handleClick(index)}
      >
        {message}
      </div>
    ));
    return (
      <div className='ui comments'>
        {messages}
      </div>
    );
  }
}

export default App;
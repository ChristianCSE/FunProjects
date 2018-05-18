
//Factory design
function createStore(reducer, initialState) {
  let state = initialState; //"private" variabile 
  const listeners = [];
  function getState(){
    return state;
  }
  function dispatch(action){
    state = reducer(state, action);
    //invoke all functiosn kept in listeners!
    listeners.forEach((subscribed_listener) => subscribed_listener());
  }
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
  if(action.type == 'ADD_MESSAGE'){
    //NOTE: concat returns a NEW array 
    return {
      messages: state.messages.concat(action.messages)
    }
  } else if(action.type == 'DELETE_MESSAGE'){
    //NOTE: Using spread operator!
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

const initialState = {messages: []};
const store = createStore(reducer, initialState);

function listener(){
  console.log('Current state: ');
  console.log(store.getState());
}

store.subscribe(listener);

const addAction1 = {
  type: 'ADD_MESSAGE',
  message: 'hello!'
};

const addAction2 = {
  type: 'ADD_MESSAGE',
  message: 'hi!'
};

const deleteAction = {
  type: 'DELETE_MESSAGE',
  index: 0
};

store.dispatch(addAction1);
store.dispatch(addAction2);
store.dispatch(deleteAction);




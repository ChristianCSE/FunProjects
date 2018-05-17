

/**
 * [Returns object with two methods & a private state] 
 * @param  {function} reducer [function taking current state & provided action]
 * @return {functions}        [getState() & dispatch(action)]
 */
function createStore(reducer){
  let state = 0;
  
  function getState() {
    return state;
  }

  function dispatch(action) {
    state = reducer(state, action);
  }
  //RETURN METHODS, ELSE YOU CANNOT INVOKE
  //THIS IS THE FACTORY PATTERN
  return {
    getState, 
    dispatch
  };
}

//basic reducer
//takes action = description of some event 
//returns New State 
function reducer(state, action) {
  if(action.type == 'INCREMENT') {
    return state + action.amount; 
  } else if(action.type == 'DECREMENT') {
    return state - action.amount; 
  } else {
    return state; 
  }
}


module.exports = {
  createStore, 
  reducer
};
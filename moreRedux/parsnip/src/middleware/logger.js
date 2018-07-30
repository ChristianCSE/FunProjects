
//NOTE: this is the required method signature for creating middleware in 
//redux!
const logger = store => next => action => {
  console.group(action.type);
  console.log('dispatching: ', action);
  //NOTE: we are ensuring that the action gets passed ot the reducers (or next midware...)
  const result = next(action); //why? 
  console.log('next state: ', store.getState() );
  console.groupEnd(action.type);
  return result;
};

export default logger;

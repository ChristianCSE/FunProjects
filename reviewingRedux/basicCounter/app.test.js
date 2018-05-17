
const { reducer, createStore } = require('./app');
console.log(reducer);
//NOTE: No need to import jest

//Action Payloads

const incrementAction = {
  type: 'INCREMENT', 
  amount: 3
};

const decrementAction = {
  type: 'DECREMENT', 
  amount: 4
};


//NOTE: Simple Store construction 
//only using 1 reducer & single layered state 
const store = createStore(reducer);


test('more flexible increment', () => {
  //dispatch simple action to store, which will be read by our reducer
  //reducer processes action and updates our state accordingly
  store.dispatch(incrementAction);
  expect(store.getState()).toBe(3);
});

test('more flexible increment', () => {
  store.dispatch(incrementAction);
  expect(store.getState()).toBe(6);
});

test('more flexible decrement', () => {
  store.dispatch(decrementAction);
  expect(store.getState()).toBe(2);
});
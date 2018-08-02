
## redux STORE & redux-thunk
=> Remember that the store in redux is ony equipped to handle ACTIONs
=> It was never intended to handle either functions or promises; hence, 
the use of `redux-thunk`


## Flow of redux-thunk
```js
export function fetchTasks() {

  //REMEMBER: This is a function aka a thunk 
  //Within this thunk, MORE action creators can be DISPATCHED => MORE SIDE EFFECTS!
  return (dispatch, getState) => {
    dispatch(fetchTasksRequest());
    dispatch(fetchTasksSuccess());
  }

}
```

Remember the flow of of Redux
action creator -> action -> middleware -> store
So we treat this function in our middleware first before sending it off to 
our STORE

This is what `redux-thunk/src/index.js` ends up being

```js
function createThunkMiddleware(extraArg) {
  return ({ dispatch, getState }) => next => action => {
    //this if statement is why we use redux-thunk
    if (typeof action === 'function' ) return action(dispatch, getState, extraArgument);
    //we invoke the `ACTION FUNCTION` with dispatch & state from STORE!
    return next(action);
  }
}
const thunk = createThunkMiddleware();
thunk.withExtraArgument = createThunkMiddleware;
export default thunk;
```
REMEMBER: The format for `redux middleware` is: 
```js
export const myMiddleware = store => next => action => {
  //where action is the action (an object) returned by our action creator 
}
```

An action using this is: 
```js 
export const createTask = ({title, description, status='Unstarted'}) => {
  //this gets sent through our middleware

  //think of it as returning a function that will be invoked by something, 
  //we obviously prefill it with what has already been provided
  return dispatch => {
    //async part
    api.createTask({title, description, status}).then((resp) => {
      //sync part
      dispatch(createTaskSucceeded(resp.data));
    })
  }


}
```


```js
//REMEMBER: dispatch is the only way to trigger a state change (this is stored in the store)
//we get access to this method because redux-thunk passes it by calling our ACTION METHOD
return dispatch => {
  api.createTask('provided_title', 'provided_descrip', 'provided_status')
  .then( (resp) => 
    //this will go through the flow of actions: 
    //action creator->action->middleware->store
    dispatch(formAction(resp.data)); 
  )
}

```


## Generators 
=> One of our sagas will be a replacemetn for the thunk that handles tasks fetching

## takeLatest & takeEvery
=> Throttle API requests to a remote server. 

## Using Channels
=> `takeEvery`: starts a new process for each `TIMER_STARTED` ACTION received. 
==> Each time a task is moved into In Progress a SEPERATE PROCESS BEGINS DISPATCHING `TIMER_INCREMENT`!
==> a `TIMER_STOPPED` ACTION would also START a NEW PROCESS SEPERATE FROM THE OTHERS. 
===> Therefore, we use `takeLatest` rather than `takeEvery`
=>`channel`: (processes) objects used to send & receive msgs b/w tasks. = give a name to a saga process

## take()
=> `take()` can be config'd to accept & respond to more than one action type at a time. 
=> pass it an array of action type strings as the first arg. 



# Selectors
`def`: Fxns used to compute derived data from the Redux store. 
`coupled`: If entity A relies on entity B to do its job, then A and B are coupled. 
=> this alone IS NOT A BAD thing
`tightly coupled`: If A is updated and you also have to make an update in B. 
=> motivation to `decoupling` is to lessen the fear of a ripple effect when changin components. 
=> Also flexibility. 
`Selectors`: Fxns that accept a state from the Redux STORE and COMPUTE DATA that'll eventually be 
passed as props to React. 
=> They are pure fxns 
=> Easy to memoize. 
**without selectors**: Components would be COUPLED directly to the SHAPE OF REDUX STORE. 
=> Store changes => update EVERY COMPONENT relying on that structure.
`derived data`: Calculation or mutation of a Redux State for displaying the data in a React component. 


# Selector & Redux
=> With Redux you can complete the filtering before the component knows it has happened 
=> **mapStateToProps()**: Provides the opportunity to derive data before making it available 
to a connected component. Again, this bridges the fap b/w data in Redux & data in Components. 
=> It is where selectors in general are applied. 
=> IOW, `selectors` are invoked in `mapStateToProps` prior to providing data to view. 

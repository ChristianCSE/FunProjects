
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

## 

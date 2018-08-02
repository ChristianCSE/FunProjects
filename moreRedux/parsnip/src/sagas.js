//NOTE: We go through this middleware to due having init
//sagaMiddleware.run(rootSaga);

//put(action): creates an EFFECT description that instructs the middleware to 
//DISPATCH an ACTION to the STORE. (non-blocking, error = downstream; hence, in reducer)

//NOTE: they are not effects
import { channel, delay } from 'redux-saga'; 

import { fork, take, call, put, takeLatest } from 'redux-saga/effects';

import {
  FETCH_TASKS_STARTED, FETCH_TASKS_SUCCEEDED, FETCH_TASKS_FAILED, TIMER_STARTED, TIMER_STOPPED
} from './constants';

import * as api from './api';
//import { delay } from '../node_modules/redux-saga';

export default function* rootSaga() {
  //NOTE: yield conventionally makes one wait until the side-effect is complete, 
  //but fork() makes it so we don't have to wait
  //NON-Blocking
  //yield fork(watchFetchTasks);
  //yield fork(watchSomethingElse);

  //this will cancel old processes when a NEW one begins
  //NOTE: this is creating a fork with extra functionality 
  //This will listen to every action of action type FETCH_TASKS_STARTED
  yield takeLatest(FETCH_TASKS_STARTED, fetchTasks);

  //using takeLatestById to avoid multiprocesses running in conflict
  //yield takeEvery(TIMER_STARTED, handleProgressTimer);
  
  //should only be invoked when TIMER_STARTED is sent 
  //yield takeLatestById(TIMER_STARTED, handleProgressTimer);
  yield takeLatestById([TIMER_STARTED, TIMER_STOPPED], handleProgressTimer);



}

function* takeLatestById(actionType, saga) {
  const channelsMap = {}; 
  //console.log('takeLatestById is this initiated on startup ...?', actionType);
  while(true) {
    const action = yield take(actionType); //this waits until action type is received?
    const { taskId } = action.payload; 
    //if taskId DNE then create a new one
    // if (channelsMap[taskId]) {
    //   //console.log('Does exist in channelsMap: ', channelsMap);
    // }
    if (!channelsMap[taskId]) {
      channelsMap[taskId] = channel(); 
      //console.log('DNE in channelsMap: ', channelsMap);
      yield takeLatest(channelsMap[taskId], saga);
    }
    //replace the existing channel with this process

    yield put(channelsMap[taskId], action);
  }
}

function* handleProgressTimer({ payload, type }){
  //NOTE: if type is TIMER_STOPPED then all we do is not go through with this 
  //It will bypass the infinite loop (NOTE: we don't treat this action type in 
  //our reducer)
  if (type === TIMER_STARTED){
  //console.log('is this invoked at startup'); this ENTIRE method is invoked!
    while (true) {
      //once it's called it stays
      //console.log('do we just wait...?');
      yield call(delay, 1000); // 1000 ms is used to delay b/w increments 
      //console.log('or does it just stop on call ...?');
      //creates an EFFECT instructing midware to DISPATCH an ACTION to the STORE
      yield put({
        type: TIMER_STARTED, 
        payload: { taskId: payload.taskId } 
      });
    }
  }
}


//fork() helps you manage EFFECTS = plain objects
//Saga's role is: RETURN a description of the logic needed in the form of an object. 

function* watchFetchTasks() {
  console.log('watching!');
}

function* watchSomethingElse(){
  console.log('watching something else!');
}

//previously named watchFetchTasks due to the infinite loop 
//which was for watching for our desired action 
function* fetchTasks() {
  //NOTE: Infinite loop, 
  // while (true) {
  //takeLatest continues to listen for the action type; hence, 
  //we no longer need to listen for the action type. 
  
  //yield take(FETCH_TASKS_STARTED);

  try{
      //BLOCKING method used to specify AJAX request 
      //we don't go on to the next method UNTIL this goes to completion
    const { data } = yield call(api.fetchTasks); 

      //NOTE: Similarly to the previous thunk format, we dispatch 
      //our actions 
    yield put({
      type: FETCH_TASKS_SUCCEEDED, 
      payload: { tasks: data }
    });
  } catch (e) {
    yield put({
      type: FETCH_TASKS_FAILED,
      payload: { error: e.message }
    });
  }
  // }
};





/*
import { call } from 'redux-saga/effects';

function* fetchExample() {
  yield call(api.method, '/all');s
}

const anEffect = {
  CALL: {
    fn: api.method, 
    args: ['/all']
  }
};

*/
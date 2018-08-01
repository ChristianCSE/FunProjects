

import { fork, take, call, put, takeLatest } from 'redux-saga/effects';

import {
  FETCH_TASKS_STARTED, FETCH_TASKS_SUCCEEDED, FETCH_TASKS_FAILED
} from './constants';

import * as api from './api';

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
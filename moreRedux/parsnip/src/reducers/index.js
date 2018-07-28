//our initial state 

// import { uniqueId } from '../actions';

// const mockTasks = [
//   {
//     id: uniqueId(), 
//     title: 'Learning', 
//     description: 'Store, actions, reducers!',
//     status: 'In Progress'
//   },
//   {
//     id: uniqueId(), 
//     title: 'Peace', 
//     description: 'No deal!',
//     status: 'In Progress'
//   }
// ];

import { 
  CREATE_TASK, 
  EDIT_TASK, 
  FETCH_TASKS_SUCCEEDED, 
  CREATE_TASK_SUCCEEDED, 
  EDIT_TASK_SUCCEEDED } from '../constants';

//once integrated with Redux, state is retrieved via store which 
//calls getState(), action is from our action creator getting dispatched 
//export default function tasks(state = {tasks: mockTasks} , action){


//DEFINING init state (current use: isLoading is false )
const initialState = {
  tasks: [], 
  isLoading: false
};

//export default function tasks(state = {tasks: []}, action){
export default function tasks(state = initialState, action){
  switch(action.type) {
    case CREATE_TASK: {
      return {
        tasks: state.tasks.concat(action.payload)
      };
    }
    //NOTE: We use concat since this will return a NEW ARRAY with the same 
    //posts from the old array, but with an added post 
    case EDIT_TASK: {
      const { payload } = action;
      
      return {
        tasks: state.tasks.map((task)=>{
          //if this is our edited task, make a new {} object, 
          //it gets everything from task assigned, and anythign that is different in 
          //paryload.params is changed in the final new object
          if(task.id === payload.id) return Object.assign({}, task, payload.params);
          return task;
        })
      };
    }
    case FETCH_TASKS_SUCCEEDED: {
      // return {
      //   tasks: action.payload.tasks
      // }
      //in order to use initialState 

      //using the spread operator in this manner is similar to using Object.assign
      return {
        ...state, 
        isLoading: false, 
        tasks: action.payload.tasks
      };
    }
    case CREATE_TASK_SUCCEEDED: {
      // return {
      //   tasks: state.tasks.concat(action.payload.task)
      // }
      return {
        ...state, 
        tasks: state.tasks.concat(action.payload.task)
      }
    }
    //NOTE: this is different from the EDIT_TASK action 
    case EDIT_TASK_SUCCEEDED: {
      const { payload } = action; 
      // return {
      //   // remember that Objects must be kept IMMUTABLE! 
      //   // ;hence, we make a completely new array 
      //   tasks: state.tasks.map(task => (task.id === payload.task.id) ? payload.task : task)
      // }
      const newTasks = state.tasks.map(task => (task.id === payload.task.id) ? payload.task : task);
      return {
        ...state, 
        tasks: newTasks
      };
    }
    default: {
      return state;
    }
  }
}




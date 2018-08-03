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
  EDIT_TASK_SUCCEEDED,
  FETCH_TASKS_STARTED, 
  FETCH_TASKS_FAILED, 
  TIMER_STARTED, 
  FILTER_TASKS,
  TASK_STATUSES } from '../constants';

import { createSelector } from 'reselect';

/**
 * abstracting & modularizing our generalized selector function
 * rather than having it all in mapStateToProps, we isolate it 
 * => easier to reuse & test individually 
 * We place selectors in /reducers due to convention
*/
// export const getFilteredTasks = (tasks, searchTerm) => {
//   return tasks.filter((task) => {
//     return task.title.match(new RegExp(searchTerm, 'i'));
//   });
// };

const getTasks = state => state.tasks.tasks;
const getSearchTerm = state => state.tasks.searchTerm;

//createSelector changes it to be a memoized selector 
//createSelector([input selectors (not memoized)], transform fxn = result of each input selector)
//being a pure fxn is important since the same input should have same output = safe associate inputs 
//with results 
export const getFilteredTasks = createSelector(
  [getTasks, getSearchTerm], 
  (tasks, searchTerm) => {
    return tasks.filter((task)=>{
      return task.title.match(new RegExp(searchTerm, 'i'));
    })
  }
);

//group task by status
export const getGroupedAndFilteredTasks = createSelector(
  // NOTE: we are using an existing memoized selector as an INPUT selector 
  [getFilteredTasks], 
  (task) => {
    //task: are tasks after being filtered!
    const grouped = {}; //['In Progress': [{}, {}, {}] ...]
    TASK_STATUSES.forEach( (status) => {
      grouped[status] = task.filter(task => task.status === status)
    });
    return grouped;
  }
)


  //once integrated with Redux, state is retrieved via store which 
//calls getState(), action is from our action creator getting dispatched 
//export default function tasks(state = {tasks: mockTasks} , action){


//DEFINING init state (current use: isLoading is false )
const initialState = {
  tasks: [], 
  isLoading: false, 
  error: null, 
  searchTerm: ''
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
    //trigger our loading animation (due to the change in state => re-render)
    case FETCH_TASKS_STARTED: {
      return {
        ...state, 
        isLoading: true
      };
    }
    case FETCH_TASKS_FAILED: {
      //NOTE: this change in state comes after another change of state
      //that is why we set isLoading to false, our request ended in an error
      return {
        ...state, 
        isLoading: false, 
        error: action.payload.error
      }
    }
    case TIMER_STARTED: {
      const nextTasks = state.tasks.map((task) => {
        return (task.id === action.payload.taskId) ?
        //again using shorthand Object.assign({}, task, ...)
        { ...task, timer: task.timer + 1 } : task;
      });
      //NOTE: This is equivalent to Object.assign() -- this is done to conserve 
      //immutability
      return { ...state, tasks: nextTasks }; 
    }
    case FILTER_TASKS: {
      return {
        ...state, 
        searchTerm: action.payload.searchTerm
      };
    }
    default: {
      return state;
    }
  }
}




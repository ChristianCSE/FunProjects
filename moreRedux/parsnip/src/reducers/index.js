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
  TASK_STATUSES, 
  FETCH_PROJECTS_STARTED,
  FETCH_PROJECTS_SUCCEEDED,
  SET_CURRENT_PROJECT_ID
} from '../constants';

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
const getTasksByProjectId = state => {
  //if no id selected/given then return blank array 
  const currProjID = state.page.currentProjectId;
  if (!currProjID) return [];
  //go through our array of projects and return the one with the selected key (stops once found)
  //note an object will be returned 
  const currentProject = state.projects.items.find(project => project.id === currProjID);
  return currentProject.tasks;
}

//createSelector changes it to be a memoized selector 
//createSelector([input selectors (not memoized)], transform fxn = result of each input selector)
//being a pure fxn is important since the same input should have same output = safe associate inputs 
//with results 
export const getFilteredTasks = createSelector(
  //[getTasks, getSearchTerm], 
  //NOTE: We changed ONE of the INPUT SELECTORS 
  [getTasksByProjectId, getSearchTerm],
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
/*
const initialState = {
  tasks: [], 
  isLoading: false, 
  error: null, 
  searchTerm: ''
};
*/

//NOTE: items added, and searchTerm removed 
const initialState = {
  items: [], //contains projects 
  isLoading: false, 
  error: null 
};

const initialPageState = {
  currentProjectId: null, 
  searchTerm: ''
};

export function page(state= initialPageState, action){ 
  
  switch (action.type) {
    case SET_CURRENT_PROJECT_ID: {
      return {
        ...state, 
        currentProjectId: action.payload.id 
      }
    }
    case FILTER_TASKS: {
      return {
        ...state, 
        searchTerm: action.payload.searchTerm
      }
    }
    default: {
      return state; 
    }
  }
}

//NOTE: Seperate reducer 
export function projects(state = initialState, action){
  //console.log('project state: ', state);
  /*
    items = [{id: 1, name: 'Short Term Goals', tasks: [{task }]}]
  */
  switch (action.type) {
    case FETCH_PROJECTS_STARTED: {
      return {
        ...state,
        isLoading: true
      };
    }
    case FETCH_PROJECTS_SUCCEEDED: {
      console.log('action.payload.projects: ', action.payload.projects);
      return {
        ...state, 
        isLoading: false, 
        items: action.payload.projects
      }
    }
    case CREATE_TASK_SUCCEEDED: {
      // return {
      //   ...state, 
      //   tasks: state.tasks.concat(action.payload.task)
      // }
      //we have to create a tasks wrt the fact that they belong to projects
      console.log('CREATE_TASK_SUCCEEDED: ', action.payload);
      const { task } = action.payload; 
      //this returns the index array position of the object 
      //your projectId has NOTHING to do your position in the array!
      const projectIndex = state.items.findIndex(project => project.id === task.projectId);
      //the project that received a new task
      const project = state.items[projectIndex];
      console.log('project => ', project);
      //by making a new task, we are essentially changing the project object too! 
      //to maintain immutability we must make A NEW ITEMS ARRAY 

      const nextProject = {
        ...project,
        tasks: project.tasks.concat(task)
      };
      return {
        ...state, 
        items: [
          ...state.items.slice(0, projectIndex), 
          nextProject, 
          ...state.items.slice(projectIndex+1)
        ]
      };
    }
    case EDIT_TASK_SUCCEEDED: {
      /*
      const { payload } = action; 
      //remember that Objects must be kept IMMUTABLE! ;hence, we make a completely new array 
      const newTasks = state.tasks.map(task => (task.id === payload.task.id) ? payload.task : task);
      return {
        ...state, 
        tasks: newTasks
      };
      */
     //previously: looped through all tasks and constructed a new array BUT only swapping out 
     //the edited task (still have task in payload, but now have to look through projects and find 
    //the project that it belongs to and then loop through that project and replace the task instance)
    const { task } = action.payload; 
    //task object NEEDS to have a projectId field!
    //this is the position in the array NOT the id  
    const projectIndex = state.items.findIndex( project => (project.id === task.projectId));
    //we have the array index position of the project now we need the task position 
    const project = state[projectIndex];
    const taskIndex = project.findIndex( oldTask => (oldTask.id === task.id)); 
    //are we reconstructing the entire Project object or just the array? 
    //project with the edited task
    const newProject = {
      ...project, 
      tasks: [
        project.tasks.slice(0, taskIndex),
        task, //the edited task
        project.tasks.slice(taskIndex+1)
      ]
    };
    //return the entire project container with the NEW UPDATED PROJECT 
    //projects exist in items
    return {
      ...state, 
      items: [
        state.items.slice(0, projectIndex), 
        newProject, 
        state.items.slice(projectIndex+1)
      ]
    };
    }
    default: {
      return state; 
    }
  }
}

//projects: RECEIVE_ENTITIES, FETCH_PROJECTS_STARTED, FETCH_PROJECTS_SUCCEEDED, CREATE_TASK_SUCCEEDED
//page: SET_CURRENT_PROJECT_ID, FILTER_TASKS


//by the end, tasks will only contain: 
//tasks: RECEIVE_ENTITIES, EDIT_TASK_SUCCEEDED, TIMER_INCREMENT 


//export default function tasks(state = {tasks: []}, action){
export function tasks(state = initialState, action){
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

/* //NOTE: This was moved to projects. (Current reason, at least to me is unknown)
    case CREATE_TASK_SUCCEEDED: {
      // return {
      //   tasks: state.tasks.concat(action.payload.task)
      // }
      return {
        ...state, 
        tasks: state.tasks.concat(action.payload.task)
      }
    }
*/

    //NOTE: this is different from the EDIT_TASK action 
    //Now in projects
    /*
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
    */


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




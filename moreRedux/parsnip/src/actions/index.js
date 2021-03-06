
import { 
  CREATE_TASK, 
  EDIT_TASK, 
  FETCH_TASKS_SUCCEEDED, 
  CREATE_TASK_SUCCEEDED,
  EDIT_TASK_SUCCEEDED,
  FETCH_TASKS_STARTED,
  FETCH_TASKS_FAILED, 
  TIMER_INCREMENT, 
  TIMER_STOPPED, 
  FILTER_TASKS, 
  FETCH_PROJECTS_STARTED, 
  FETCH_PROJECTS_SUCCEEDED,
  FETCH_PROJECTS_FAILED,
  SET_CURRENT_PROJECT_ID, 
  TIMER_STARTED
} from '../constants';
import * as api from '../api';

// let _id = 1;

// export const uniqueId = () => _id++;
//export function uniqueId() { return _id++; }

//our action object
const actionCreateTask = (id, title, description, status) => {
  //ACTION OBJECT = {type, payload: }
  return {
    type: CREATE_TASK, 
    payload: {
      id, 
      title, 
      description, 
      status
    }
  };
}

//sync Action Creator
const createTaskSucceeded = (task) => {
  return {
    type: CREATE_TASK_SUCCEEDED,
    payload: {
      task
    }
  };
};


//this is our action creator 
// export const createTask = ({ title, description}) => {
// //export function createTask({title, description}){
//   //you could just make it here rather than having a function that 
//   //makes the action object
//   return actionCreateTask(uniqueId(), title, description, 'Unstarted');
// };

//async Action creator
export const createTask = (
  { 
    title, 
    description, 
    status='Unstarted', 
    //THIS WAS NEVER SPECIFIED!!!!!!
    projectId
  }
  ) => {
  return dispatch => {
    //async part
    //NOTE: projectId is appended as a field for our task 
    api.createTask({title, description, status, projectId}).then((resp) => {
      //sync part
      dispatch(createTaskSucceeded(resp.data));
    })
  }
}



//action creator for allowing one to edit some field from a Task

const actionEditTask = (id, params) => {
  return {
    type: EDIT_TASK, 
    payload: {
      id, 
      params
    }
  };
};

// export const editTask = (id, params={}) => {
//   return actionEditTask(id, params);
// };


export const fetchTasksSucceeded = (taskId) => {
  return {
    type: FETCH_TASKS_SUCCEEDED,
    payload: {
      taskId
    }
  };
};

//this function is triggered as return fetchTasks()(filler)
//where filler fills in the variable named dispatch [work done by redux-thunk]
// export const fetchTasks = () => {
//   return dispatch => {
//     let apiTasks= `${API_ENDPOINT}/tasks`;
//     axios.get(apiTasks).then((resp) => {
//       console.log('resp: ', resp);
//       dispatch(fetchTasksSucceeded(resp.data));
//     })
//   }
// };


//UPDATED in order to show loading animation 
// export const fetchTasks = () => {
//   return dispatch => {
//     return api.fetchTasks().then((resp) => {
//       dispatch(fetchTasksSucceeded(resp.data));
//     });
//   }
// };

//this is our action!


//tasks = array
const getTaskById = (tasks, id) => tasks.find(task => task.id === id);


// export const editTask = (id, params={}) => {
//   //redux thunk allows us to send functions to the ... store? 
//   return (dispatch, getState) => {
//     // get specific task (sub-state) wrt id
//     const task = getTaskById(getState().tasks.tasks, id); 
//     // IMMUTABILITY needs to be maintained
//     const updatedTask = Object.assign({}, task, params);
//     // invoke API (then dispatch action )
//     api.editTask(id, updatedTask)
//     .then((resp) => {
//       dispatch(editTaskSucceeded(resp.data));
//     }).catch(err => {
//     });
//   }
// };

const progressTimerStart = (taskId) => {
  return { 
    type: TIMER_STARTED, 
    payload: {taskId} 
  };
};

const progressTimerStop = (taskId) => {
  return {
    type: TIMER_STOPPED, 
    payload: { taskId }
  };
};
const editTaskSucceeded = (task) => {
  return {
    type: EDIT_TASK_SUCCEEDED, 
    payload: {
      task
    }
  };
};

//export const editTask = (id, params={}) => {
export const editTask = (task, params={}) => {  
  return (dispatch, getState) => {
    //const tasks = getTaskById(getState().tasks.tasks, id);
    console.log('params: ', params);
    console.log('task=> ', task);
    const updatedTask = {
      ...task, 
      ...params
    };

    api.editTask(task.id, updatedTask)
    .then( (resp) => {
      //NOTE: WE have not returned; hence, this the method continues to go 
      dispatch( editTaskSucceeded(resp.data) );
      //An action that will trigger countdown! 
      if (resp.data.status === 'In Progress') {
        dispatch( progressTimerStart(resp.data.id) );
      }
      //if old status was In Progress that means we should stop the timer 
      //editTask is ONLY triggered by changing status; hence, your old status
      //is no longer your current status, since you obviously just updated it. 
      if (task.status === 'In Progress') {
        return dispatch( progressTimerStop(resp.data.id) );
      }
    })


  }
}


const fetchTasksStarted = () => {
  return {
    type: FETCH_TASKS_STARTED
  };
};


//NOTE: that pattern of this action creator 
//2 actions are made 

/*
export const fetchTasks = () => {
  return (dispatch) => {
    dispatch(fetchTasksStarted());
    api.fetchTasks()
    .then((resp) => {
      
      // //we set a 2 second wait 
      setTimeout(()=>{
        dispatch(fetchTasksSucceeded(resp.data));
      }, 2000);
      //ATM we are forcing an error
      //throw new Error('Oh noes! Unable to fetch tasks!');
    }).catch((err) => {
      dispatch(fetchTasksFailed(err.message));
    });
  }
};
*/

//NOTE: This is now sufficient due to sagas
export const fetchTasks = () => {
  return { type: FETCH_TASKS_STARTED };
}

//We are creating an Error action 
const fetchTasksFailed = (error) => {
  return {
    type: FETCH_TASKS_FAILED, 
    payload: {
      error
    }
  };
};


export const filterTasks = (searchTerm) => {
  return {
    type: FILTER_TASKS, 
    payload: {
      searchTerm
    }
  };
};


//Implementing fetchProjects and following generic flow 
//START, SUCCESS || FAILURE 

const fetchProjectStarted = (boards) => ( {type: FETCH_PROJECTS_STARTED, payload: {boards}} );

const fetchProjectSucceeded = (projects) => ( {type: FETCH_PROJECTS_SUCCEEDED, payload: {projects}} );

const fetchProjectFailed = (err) => ( {type: FETCH_PROJECTS_FAILED, payload: {err}} );

export const fetchProjects = () => {
  return (dispatch, getState) => {
    dispatch(fetchProjectStarted()); //have initiated request 
    return api.fetchProjects()
    .then((resp) => {
      //console.log('is this even callled? ', resp);
      const projects = resp.data; 
      console.log('Remember that projects, due to json-server, embedd tasks by doing _embed=tasks in our get request');
      console.log('projects should contain tasks: ', projects);
      dispatch(fetchProjectSucceeded(projects));
    }).catch((err) => {
      console.error('ERROR fetchProjects: ', err);
      dispatch(fetchProjectFailed(err));
    });
  };
};

export const setCurrentProjectId = (id) => ( {type: SET_CURRENT_PROJECT_ID, payload: {id}} );
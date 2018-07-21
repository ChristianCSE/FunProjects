
import { CREATE_TASK, EDIT_TASK, FETCH_TASKS_SUCCEEDED } from '../constants';
import * as api from '../api';
let _id = 1;

export const uniqueId = () => _id++;
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

//this is our action creator 
export const createTask = ({ title, description}) => {
//export function createTask({title, description}){
  //you could just make it here rather than having a function that 
  //makes the action object
  return actionCreateTask(uniqueId(), title, description, 'Unstarted');
};



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

export const editTask = (id, params={}) => {
  return actionEditTask(id, params);
};


export const fetchTasksSucceeded = (tasks) => {
  return {
    type: FETCH_TASKS_SUCCEEDED,
    payload: {
      tasks
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


export const fetchTasks = () => {
  return dispatch => {
    return api.fetchTasks().then((resp) => {
      dispatch(fetchTasksSucceeded(resp.data));
    });
  }
};

//console.log(createTask({title: 'nothing', description: 'something'}));

let _id = 1;

export const uniqueId = () => _id++;
//export function uniqueId() { return _id++; }

const CREATE_TASK = 'CREATE_TASK';
const EDIT_TASK = 'EDIT_TASK';
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


//console.log(createTask({title: 'nothing', description: 'something'}));
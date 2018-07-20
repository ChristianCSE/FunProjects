//our initial state 

import { uniqueId } from '../actions';

const mockTasks = [
  {
    id: uniqueId(), 
    title: 'Learning', 
    description: 'Store, actions, reducers!',
    status: 'In Progress'
  },
  {
    id: uniqueId(), 
    title: 'Peace', 
    description: 'No deal!',
    status: 'In Progress'
  }
];


//once integrated with Redux, state is retrieved via store which 
//calls getState(), action is from our action creator getting dispatched 
export default function tasks(state = {tasks: mockTasks} , action){
  if (action.type === 'CREATE_TASK') {
    return {
      tasks: state.tasks.concat(action.payload)
    };
    //NOTE: We use concat since this will return a NEW ARRAY with the same 
    //posts from the old array, but with an added post 
  }

  if (action.type === 'EDIT_TASK') {
    const { payload } = action;
    return {
      tasks: state.tasks.map((task) => {
        //if this is our edited task, make a new {} object, 
        //it gets everything from task assigned, and anythign that is different in 
        //paryload.params is changed in the final new object
        if (task.id === payload.id) return Object.assign({}, task, payload.params);
        return task;
      })
    }
  }
  return state;
};


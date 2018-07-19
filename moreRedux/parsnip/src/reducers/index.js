//our initial state 
const mockTasks = [
  {
    id: 1, 
    title: 'Learning', 
    description: 'Store, actions, reducers!',
    status: 'In Progress'
  },
  {
    id: 2, 
    title: 'Peace', 
    description: 'No deal!',
    status: 'In Progress'
  }
];

export default function tasks(state = {tasks: mockTasks} , action){
  return state;
};
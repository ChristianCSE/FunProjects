
import axios from 'axios';
const API_BASE_URL = 'http://localhost:3001'

const client = axios.create({
  baseURL: API_BASE_URL, 
  headers: {
    'Content-Type': 'application/json'
  }
});

//NOTE: this will return a Promise 
export const fetchTasks = () => client.get('/tasks');

export const createTask = (params) => client.post('/tasks', params);

//NOTE: Using axios directly for our PUT request
//Previously had error with api name! (was giving a 404 error)
export const editTask = (id, params) => axios.put(`${API_BASE_URL}/tasks/${id}`, params);


//NOTE: ?_embed=tasks is specifying that tasks SHOULD BE EMBEDDED WITHIN PROJECTS 
//in the API RESP! 
export const fetchProjects = () => client.get('/projects?_embed=tasks');

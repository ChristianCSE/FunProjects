
import axios from 'axios';
const API_BASE_URL = 'http://localhost:3001'

const client = axios.create({
  baseURL: API_BASE_URL, 
  headers: {
    'Content-Type': 'application/json'
  }
});

//NOTE: this will return a Promise 
export const fetchTasks = () => {
  console.log('wtf is goign on nnnnnn');
  return client.get('/tasks');
}

export const createTask = (params) => client.post('/tasks', params);

//NOTE: Using axios directly for our PUT request
//Previously had error with api name! (was giving a 404 error)
export const editTask = (id, params) => axios.put(`${API_BASE_URL}/tasks/${id}`, params);


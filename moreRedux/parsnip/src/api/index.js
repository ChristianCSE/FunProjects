
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
export const editTask = (id, params) => axios.put(`${API_BASE_URL}/task/${id}`, params);


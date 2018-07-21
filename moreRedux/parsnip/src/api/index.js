
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



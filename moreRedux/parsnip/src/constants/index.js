export const TASK_STATUSES = ['Unstarted', 'In Progress', 'Completed'];

//action types 
export const CREATE_TASK = 'CREATE_TASK';
export const EDIT_TASK = 'EDIT_TASK';
export const FETCH_TASKS_SUCCEEDED = 'FETCH_TASKS_SUCCEEDED';
export const CREATE_TASK_SUCCEEDED = 'CREATE_TASK_SUCCEEDED';
export const EDIT_TASK_SUCCEEDED = 'EDIT_TASK_SUCCEEDED';
export const FETCH_TASKS_STARTED = 'FETCH_TASKS_STARTED';
export const FETCH_TASKS_FAILED = 'FETCH_TASKS_FAILED';
export const TIMER_INCREMENT = 'TIMER_INCREMENT';
export const TIMER_STOPPED = 'TIMER_STOPPED';
export const FILTER_TASKS = 'FILTER_TASKS';

export const TIMER_STARTED = 'TIMER_STARTED';

export const FETCH_PROJECTS_STARTED = 'FETCH_PROJECTS_STARTED';
export const FETCH_PROJECTS_SUCCEEDED = 'FETCH_PROJECTS_SUCCEEDED';
export const FETCH_PROJECTS_FAILED = 'FETCH_PROJECTS_FAILED';


export const SET_CURRENT_PROJECT_ID = 'SET_CURRENT_PROJECT_ID';

// dev endpoint
export const API_ENDPOINT = 'http://localhost:3001';

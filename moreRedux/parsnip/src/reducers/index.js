
/* import all action types */
import { 
  CREATE_TASK, 
  EDIT_TASK, 
  FETCH_TASKS_SUCCEEDED, 
  CREATE_TASK_SUCCEEDED, 
  EDIT_TASK_SUCCEEDED,
  FETCH_TASKS_STARTED, 
  FETCH_TASKS_FAILED, 
  TIMER_INCREMENT, 
  TIMER_STARTED,
  FILTER_TASKS,
  TASK_STATUSES, 
  FETCH_PROJECTS_STARTED,
  FETCH_PROJECTS_SUCCEEDED,
  SET_CURRENT_PROJECT_ID
} from '../constants';

import { createSelector } from 'reselect';

/* generalized selector functions */
//PURP: Abstracting & modularizing from mapStateToProps, we are isolating it 
//=> easier to reusue & test individually (placed in reducers by convention)
const getTasks = state => state.tasks.tasks;
const getSearchTerm = state => state.tasks.searchTerm; 
const getTasksByProjectId = state => {
  const currentProjectID = state.page.currentProjectId;
  if (!currentProjectID) return [];
  const currentProject = state.projects.items.find(project => project.id === currentProjectID);
  return currentProject.tasks;
};

//createSelector changes it to be a memoized selector
//createSelector([input selectors], transform fxn, param = result from our input selectors)
export const getFilteredTasks = createSelector(
  [getTasksByProjectId, getSearchTerm],
  (tasks, searchTerm) => {
    return tasks.filter(task => {
      return task.title.match(new RegExp(searchTerm, 'i'));
    });
  }
);

//NOTE: We are using a MEMOIZED SELECTOR as an INPUT SELECTOR
export const getGroupedAndFilteredTasks = createSelector(
  [getFilteredTasks], 
  (task) => {
    const grouped = {};
    TASK_STATUSES.forEach( (status) => {
      grouped[status] = task.filter(task => task.status === status );
    });
    return grouped;
  }
);

//rememnber that once we've integrated with Redux that state is retrieved via store = getState()



//NOTE: We init our current project with null in order to prevent pulling tasks from startup
const initialPageState = {
  currentProjectId: null,
  searchTerm: ''
};

const initialState = {
  items: [], 
  isLoading: false,
  error: null
};

export function page(state = initialPageState, action) {
  switch(action.type) {
    case SET_CURRENT_PROJECT_ID: {
      return {
        ...state, 
        currentProjectId: action.payload.id
      };
    } 
    case FILTER_TASKS: {
      return {
        ...state, 
        searchTerm: action.payload.searchTerm
      };
    }
    default: {
      return state;
    }
  }
}

export function projects(state = initialState, action) {
  switch(action.type) {
    case FETCH_PROJECTS_STARTED: {
      return {
        ...state, 
        isLoading: true
      };
    }
    case FETCH_PROJECTS_SUCCEEDED: {
      return {
        ...state, 
        isLoading: false, 
        items: action.payload.projects
      };
    }
    case CREATE_TASK_SUCCEEDED: {
      const { task } = action.payload;
      const projectIndex = state.items.findIndex(project => project.id === task.projectId);
      const project = state.items[projectIndex];
      const newProject = {
        ...state, 
        tasks: project.tasks.concat(task)
      };
      return {
        ...state, 
        items: {
          ...state.items.slice(0, projectIndex),
          newProject, 
          ...state.items.slice(projectIndex+1)
        }
      }
    }
    case EDIT_TASK_SUCCEEDED: {
      //NOTE: We have to constantly loop through arrays to find array indices since our data is nested
      const { task } = action.payload; 
      const projectIndex = state.items.findIndex(project=> project.id===task.projectId );
      const project = state.items[projectIndex];
      const taskIndex = project.task.findIndex( currTask => currTask.id === task.id);
      const newProject = {
        ...project, 
        tasks: [
          ...project.tasks.slice(0, taskIndex),
          task, 
          ...project.tasks.slice(taskIndex+1)
        ]
      };

      return {
        ...state, 
        items: [
          ...state.items.slice(0, projectIndex), 
          newProject,
          ...state.items.slice(projectIndex+1)
        ]
      };
    }
    default: {
      return state;
    }
  }
}

export function tasks(state = initialState, action) {
  switch(action.type) {
    case CREATE_TASK: {
      return {
        tasks: state.tasks.concat(action.payload)
      };
    }
    case EDIT_TASK: {
      const { payload } = action; 
      return {
        tasks: state.tasks.map((task) => {
          if (task.id ==payload.id ) return Object.assign({}, task, payload.params);
          return task;
        })
      }
    }
    case FILTER_TASKS: {
      return {
        ...state, 
        searchTerm: action.payload.searchTerm
      };
    }
    case FETCH_TASKS_STARTED: {
      return {
        ...state, 
        isLoading: true
      }
    }
    case FETCH_TASKS_SUCCEEDED: {
      return {
        ...state, 
        isLoading: false, 
        tasks: action.payload.tasks
      }
    }
    case FETCH_TASKS_FAILED: {
      return {
        ...state, 
        isLoading: false, 
        error: action.payload.error
      };
    }
    case TIMER_INCREMENT: {
      const nextTasks = state.tasks.map((task)=>{
        if(task.id === action.payload.taskId) return { ...task, timer: task.timer + 1};
        return task;
      });
      return {
        ...state, 
        tasks: nextTasks
      };
    }
    default: {
      return state; 
    }
  }
}
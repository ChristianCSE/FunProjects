import React from 'react';
import { connect } from 'react-redux'; 

/* Components */
import TasksPage from './components/TasksPage';
import Header from './components/Header';
import FlashMessage from './components/FlashMessage';

/* actions */
import {
  createTask, 
  editTask, 
  filterTask, 
  fetchProjects, 
  setCurrentProjectId
} from './actions';

/* reducers */
import { getGroupedAndFilteredTasks } from './reducers';

/* constants */
import { SET_CURRENT_PROJECT_ID } from './constants';

class App extends React.Component {
  
  componentDidMount() {
    //after loading up, we invoked this action 
    this.props.dispatch( fetchProjects() );
  }

  //FORMAT: onSOMEACTION are all callbacks that are usually passed downstream 
  //to children components since they need access to dispatch (they aren't connected to the store)

  //event has the value as a string, we need to cast it into a number 
  //NOTE: dispatch 
  onCurrentProjectChange = (e) => {
    this.props.dispatch( setCurrentProjectId( Number(e.target.value ) ) );
  }

  onCreateTask = ({ title, description }) => {
    this.props.dispatch(
      createTask({
        title, 
        description, 
        projectId: this.props.currentProjectId
      })
     );
  }

  onStatusChange = (id, status) => {
    this.props.dispatch( editTask( id, { status } ) );
  }

  onSearch = (searchTerm) => {
    this.props.dispatch( getGroupedAndFilteredTasks(searchTerm) );
  }

  render() {
    return(
      <div className="container">
        { this.props.error && <FlashMessage message={this.props.error} />}
        <div className="main-content"> 
          <Header 
            projects = {this.props.projects}
            onCurrentProjectChange={this.onCurrentProjectChange}
          />
          <TasksPage 
            tasks={this.props.tasks}
            isLoading={this.props.isLoading}
            onCreateTask={this.onCreateTask}
            onStatusChange={this.onStatusChange}
            onSearch={this.onSearch}
          />
        </div>
      </div>
    );
  }

}

//NOTE: bridges the gap b/w Redux & React 
//Our STORE contains our App's STATE, this is simply MAPPING 
//the STORE (state) into PROPS for COMPONENT PROP CONSUMPTION 
const mapStateToProps = (state) => {
  console.log(state);
  const { isLoading, error, items } = state.projects;
  const currentProjectId = state.page.currentProjectId;
  //the component associated with this via connect() will 
  //have access TO THESE PARTS OF OUR STORE STATE!
  //NOTE: DISPATCH IS IMPLICITYLY PASSED TOO!!!!!!!!
  return {
    tasks: getGroupedAndFilteredTasks(state), 
    currentProjectId,
    projects: items, 
    isLoading, 
    error 
  };
};

//Passing the sub-states (or pieces of store state) to App
//NOTE: DISPATCH IS IMPLICITYLY PASSED TOO!!!!!!!!
export default connect(mapStateToProps)(App);
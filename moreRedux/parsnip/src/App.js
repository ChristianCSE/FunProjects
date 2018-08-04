import React from 'react';
import { connect } from 'react-redux';


import TasksPage from './components/TasksPage';
import Header from './components/Header';
import FlashMessage from './components/FlashMessage';
import { 
  createTask, 
  editTask, 
  fetchTasks, 
  filterTasks, 
  fetchProjects, 
  setCurrentProjectId
} from './actions';
// import { getFilteredTasks } from './reducers';
import { getGroupedAndFilteredTasks } from './reducers';
import { SET_CURRENT_PROJECT_ID } from './constants';


//<TasksPage tasks={mockTasks} /> 
/* 
Store provides only one way to update state! 
=> DISPATCHING AN ACTIOn
=> dispatch: store's API 
=> connect(mapStateToProps)(App), the method connect() provides this method as prop 
to your container component 
*/
class App extends React.Component {

  
  //initiating our state
  componentDidMount() {
    //NOTE: Once the component mounts, we fetch all our tasks 
    //this.props.dispatch(fetchTasks());
    
    //NOTE: We have reconstructed the app to group tasks by projects 
    this.props.dispatch(fetchProjects());
  }

  //callback for changing project
  onCurrentProjectChange = (e) => {

    //NOTE: THIS IS A STRING!!!!!!!! THIS IS A STRING!!!!
    this.props.dispatch( setCurrentProjectId( Number(e.target.value) ) );
  }

  onCreateTask = ({title, description }) => {
    //we have access to this.props.dispatch due to 
    //connect()(App);
    this.props.dispatch(
      createTask({ 
        title, 
        description, 
        projectId: this.props.currentProjectId
      })
    );
  }

  onStatusChange = (id, status) => {
    //NOTE: we are using editTask for one particular edit
    //the action creator is generaized, but this onXChange is specific status 
    //NOTE: editTask is an imported action and we do the mapping to props in App
    //rather than through some redux API method 
    this.props.dispatch(editTask(id, { status }));
  }

  //passing callback since the method that needs to call this method is 
  //not connected to the store
  onSearch = (searchTerm) => {
    this.props.dispatch(filterTasks(searchTerm));
  }
  
  render(){
    //this should our init state 
    //AND 
    //dispatch prop 
    return(
      //NOTE: placed an error message! 
      //NOTE: the error is rendered within our normal component, 
      //this is in contrast with an if else where only the error would appear 
      <div className="container">
        { this.props.error && <FlashMessage message={this.props.error} /> }
        <div className="main-content">
          <Header 
            // we have access to projects due to mapStateToProps
            projects={this.props.projects}
            //remember to always place this!
            onCurrentProjectChange={this.onCurrentProjectChange}
          />
          <TasksPage 
            tasks={this.props.tasks} 
            onCreateTask={this.onCreateTask}
            //NOTE: This is just using React to send the onStatusChange method
            //to our child compoennt!
            onStatusChange={this.onStatusChange}
            //NOTE: this property from our state (in the store) will trigger a loading animation 
            //we use this.props.x since we are retrieving it from mapStateToProps
            isLoading = {this.props.isLoading}
            //for filtering search and passing callback to child component 
            onSearch={this.onSearch}
          />
        </div>
      </div>
    );
  }
};

//A transform that bridges the gap b/w Redux & React 
//Remember, our store contains our App's state 
//this is simply mapping the Store (state) into 
//Props for Component prop consumption
const mapStateToProps = (state) => {
  //for each key returned from Redux STORE make their data available to Components via Props
  //const { tasks, isLoading, error } = state.tasks; 
  //const { tasks, isLoading, error, searchTerm } = state.tasks; 
  
  const { isLoading, error, items } = state.projects; 
  console.log('mapStateToProps: ', items);
  //doing the filtering here allows the components to be more generic and flexible 
  // const tasks = state.tasks.tasks.filter((task) => {
  //   //case insentive flag = i
  //   //filter only keeps the item iff returned true
  //   //NOTE: input is not guarenteed to be clean (errors can occur)
  //   return task.title.match(new RegExp(searchTerm, 'i'));
  // });

  //return { tasks: getFilteredTasks(tasks, searchTerm), isLoading, error };
  //NOTE: getGroupedAndFilteredTasks() also invokes getFilteredTasks
  //Also, we are sending the entire state rather than individual sub-states
  // return { 
  //   tasks: getGroupedAndFilteredTasks(state), 
  //   isLoading, 
  //   error
  // };
  //Remember that our App component has prop access to these parts of our store state! 
  return {
    tasks: getGroupedAndFilteredTasks(state), 
    //This is probably furhter down 
    currentProjectId: state.page.currentProjectId,
    projects: items, 
    isLoading, 
    error
  };
};
//due to this, we now refer to our state as this.props.tasks

export default connect(mapStateToProps)(App);

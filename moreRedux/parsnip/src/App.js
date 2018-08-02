import React from 'react';
import { connect } from 'react-redux';


import TasksPage from './components/TasksPage';
import FlashMessage from './components/FlashMessage';
import { createTask, editTask, fetchTasks, filterTasks } from './actions';

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
    this.props.dispatch(fetchTasks());
  }

  onCreateTask = ({title, description }) => {
    //we have access to this.props.dispatch due to 
    //connect()(App);
    this.props.dispatch(createTask({ title, description }));
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
  const { isLoading, error, searchTerm } = state.tasks; 
  
  //doing the filtering here allows the components to be more generic and flexible 
  const tasks = state.tasks.tasks.filter((task) => {
    //case insentive flag = i
    //filter only keeps the item iff returned true
    //NOTE: input is not guarenteed to be clean (errors can occur)
    return task.title.match(new RegExp(searchTerm, 'i'));
  });

  return { tasks, isLoading, error };
};
//due to this, we now refer to our state as this.props.tasks

export default connect(mapStateToProps)(App);

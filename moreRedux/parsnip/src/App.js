import React from 'react';
import { connect } from 'react-redux';


import TasksPage from './components/TasksPage';
import { createTask, editTask, fetchTasks } from './actions';

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

  render(){
    //this should our init state 
    //AND 
    //dispatch prop 
    return(
      <div className="main-content">
        <TasksPage 
          tasks={this.props.tasks} 
          onCreateTask={this.onCreateTask}
          //NOTE: This is just using React to send the onStatusChange method
          //to our child compoennt!
          onStatusChange={this.onStatusChange}
        />
      </div>
    );
  }
};

//Remember, our store contains our App's state 
//this is simply mapping the Store (state) into 
//Props for Component prop consumption
const mapStateToProps = (state) => {
  return { tasks: state.tasks };
};
//due to this, we now refer to our state as this.props.tasks

export default connect(mapStateToProps)(App);

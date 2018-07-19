import React from 'react';
import { connect } from 'react-redux';
import TasksPage from './components/TasksPage';

//<TasksPage tasks={mockTasks} /> 
class App extends React.Component {
  render(){
    return(
      <div className="main-content">
        <TasksPage tasks={this.props.tasks} />
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

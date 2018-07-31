
import React from 'react';
import TaskList from './TaskList';

const TASK_STATUSES = ['Unstarted', 'In Progress', 'Completed'];

class TasksPage extends React.Component {
  
  //NOTE: no constructor 
  //NOTE: local state
  state = {
    showNewCardForm: false, 
    title: '',
    description: ''
  };

  //you could be explicit and do an onPropertyChange()
  //or you could do a generic onXChange
  //provide a name field 
  onPropertyChange = (e, {name}) => {
    //e.target.name = name
    this.setState({ [name] : e.target.value });
  }

  onTitleChange = (e) => {
    this.setState({ title: e.target.value });
  }

  onDescriptionChange = (e) => {
    this.setState({ description: e.target.value });
  }

  resetForm = () => {
    this.setState({ 
      showNewCardForm: false, 
      title: '',
      description: ''
    });
  }
  ///method tells the user agent that if the event does not get 
  //explicitly handled, its default action should not be taken 
  //as it normally would be.
  //e.g. Toggling a checkbox is the default action of clicking on a checkbox.
  onCreateTask = (e) => {
    console.log(this.state);
    e.preventDefault();
    this.props.onCreateTask({
      title: this.state.title, 
      description: this.state.description
    });
    this.resetForm(); 
  }

  toggleForm = () => {
    this.setState({
      showNewCardForm: !this.state.showNewCardForm
    });
  }

  renderTasksLists = () => {
    const { tasks } = this.props;
    return TASK_STATUSES.map((status) => {
      //console.log('renderTasksLists: ',tasks);
      const statusTasks = tasks.filter(task => task.status === status);

      //all these passed properties get passed under props.NAME
      return(
        <TaskList 
          key={status} 
          status={status} 
          tasks={statusTasks} 
          //we continue the downward flow of the action creator 
          onStatusChange={this.props.onStatusChange}
        />
      );
    });
  }

  render() {
    //for our loading animation we use an if statement 
    //NOTE: remember when our state property is updated to false this will re-render
    if (this.props.isLoading) {
      return (
        <div className="tasks-loading">
          Loading ...
        </div>
      );
    }
    return (
      <div className="task-list">
        
        <div className="task-list-header">
          <button 
            className="button button-default"
            onClick={this.toggleForm}
          >
           + New task
          </button>
        </div>
        {
          this.state.showNewCardForm && (
            // we need to DISPATCH an ACTION to add a new task
            <form className="task-list-form" onSubmit={this.onCreateTask}>
              
              <input 
                className="full-width-input"
                onChange={this.onTitleChange}
                value={this.state.title}
                type="text"
                placeholder="title"
              />

              <input 
                className="full-width-input"
                onChange={this.onDescriptionChange}
                value={this.state.description}
                type="text"
                placeholder="description"
              />
              <button 
                className="button"
                type="submit"
              >
                Save
              </button>
            </form>
          )
        }
        <div className="task-lists">
          {this.renderTasksLists()}
        </div>
      </div>
      
    );
  }
};

export default TasksPage;
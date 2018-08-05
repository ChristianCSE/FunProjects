
import React from 'react';
import TaskList from './TaskList';

//const TASK_STATUSES = ['Unstarted', 'In Progress', 'Completed'];
/*
Due to TasksPage not being a CONNECTED COMPONENT, DIPSATCHING an ACTION
will have to TAKE PLACE in ITS PARENT COMPONENT. 
=> Its parent must pass a callback for it to dispatch an action. 
*/


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


  //NOTE: We are rendering another component here!
  renderTasksLists = () => {
    
    //previously looped through all tasks and filtered by Status
    // O(# of statuses * N)
    // const { tasks } = this.props;
    // return TASK_STATUSES.map((status) => {
    //   //console.log('renderTasksLists: ',tasks);
    //   const statusTasks = tasks.filter(task => task.status === status);

    //   //all these passed properties get passed under props.NAME
    //   return(
    //     <TaskList 
    //       key={status} 
    //       status={status} 
    //       tasks={statusTasks} 
    //       //we continue the downward flow of the action creator 
    //       onStatusChange={this.props.onStatusChange}
    //     />
    //   );
    // });
    
    //now looping by O(# of statuses)
    const { onStatusChange, tasks } = this.props; 
    return Object.keys(tasks).map( (status) => {
      //tasks are grouped by status key, retrieve the array of tasks 
      //categorized under the current status 
      const tasksByStatus = tasks[status];
      return (
        <TaskList 
          key={status}
          status={status}
          tasks={tasksByStatus}
          onStatusChange={onStatusChange}
        />
      );
    });
  }

  onSearch = (e) => {
    //console.log('search term: ', e.target.value); 
    //invoking callback that dispatches an action! 
    this.props.onSearch(e.target.value);
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
      <div className="tasks">
        
        <div className="tasks-header">
          <input 
            onChange={this.onSearch}
            type="text"
            placeholder="Search ..."
          />
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
            <form className="new-task-form" onSubmit={this.onCreateTask}>
              
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
        {/* we are invoking a method to make our tasks components  */}
        <div className="task-lists">
          {this.renderTasksLists()}
        </div>
      </div>
      
    );
  }
};

export default TasksPage;
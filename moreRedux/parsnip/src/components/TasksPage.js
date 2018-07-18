
import React from 'react';
import TaskList from './TaskList';

const TASK_STATUSES = ['Unstarted', 'In Progress', 'Completed'];

class TasksPage extends React.Component {
  renderTasksLists(){
    const { tasks } = this.props;
    return TASK_STATUSES.map((status) => {
      const statusTasks = tasks.filter((task) => {
        return task.status === status;
      });
      //all these passed properties get passed under props.NAME
      return(<TaskList key={status} status={status} tasks={statusTasks} />);
    });
  }

  render() {
    return (
      <div className="tasks">
        <div className="task-lists">
          {this.renderTasksLists()}
        </div>
      </div>
    );
  }
};

export default TasksPage;
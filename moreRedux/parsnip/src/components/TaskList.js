//Stateless Functional Component = Presentational Component

import React from 'react';
import Task from './Task';

const TaskList = (props) => {
  return (
    <div className="task-list">
      <div className="task-list-title">
        <strong>{props.status}</strong>
      </div>
      {
        props.tasks.map((task)=>{
          //passing our props
          return(<Task key={task.id} task={task} />)
        })
      }
    </div>
  );
};

export default TaskList;
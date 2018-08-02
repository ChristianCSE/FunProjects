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
        //constructing a Task Component per task json object 
        props.tasks.map((task)=>{
          //passing our props
          return(
            <Task 
              key={task.id} 
              task={task} 
              //NOTE: Remember that this is a presentational comp 
              //;hence, no concept of this!
              onStatusChange={props.onStatusChange}
            />
          )
        })
      }
    </div>
  );
};

export default TaskList;
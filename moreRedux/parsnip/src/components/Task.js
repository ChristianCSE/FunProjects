//Stateless Functional Component = Presentational Component

import React from 'react';

import { TASK_STATUSES } from '../constants';

//NOTE: Having decomposed our components into pieces 
//makes things like incorporating a dropdown <Select ></Select >
//on indivdual Tasks easy!
const Task = (props) => {

  //NOTE: That we had to pass down this method from App (our top parent component)
  const onStatusChange = (e) => {
    props.onStatusChange(props.task.id, e.target.value);
  };

  return(
    <div className="task">
      <div className="task-header">
        <div> {props.task.title} </div>
        <select value={props.task.status} onChange={onStatusChange}>
          {
            TASK_STATUSES.map((status) => {
              return(
                <option key={status} value={status}> {status} </option>
              );
            })
          }
        </select>
      </div>
      <hr/>
      <div className="task-body"> {props.task.description} </div>
    </div>
  );
};

export default Task;
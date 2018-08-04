
import React from 'react';

class Header extends React.Component {
  render(){
    console.log(this.props);
    const projectOptions = this.props.projects.map((project)=>{
      return (
        <option key={project.key} value={project.id}>
          {project.name}
        </option>
      );
    });

    return(
      <div className="project-item">
        Project: 
          {/* need to setup callback in App (parent) */}
          <select onChange={this.props.onCurrentProjectChange}>
            {projectOptions}
          </select>
      </div>
    );
  }
}

export default Header;
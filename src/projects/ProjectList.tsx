import ProjectCard from "./ProjectCard";
import React, { useState } from "react";

import { Project } from "./Project";
import ProjectForm from "./ProjectForm";

interface ProjectListProps {
  projects: Project[];
  onSave: (project: Project) => void;
}

function ProjectList({ projects, onSave }: ProjectListProps) {

  const [projectBeingEdited, setProjectBeingEdited ] = useState(0);

  const handleSave = (project: Project) => {
    onSave(project);
    setProjectBeingEdited(0);
  }

  const handleEdit = (project: Project) => {    
    setProjectBeingEdited(project.id ? project.id : 0);
  };

  const cancelEditing = () => {
      setProjectBeingEdited(0);
  }

  const items = projects.map(project => (
    <div key={project.id} className="cols-sm">
      {project.id === projectBeingEdited ? (
        <ProjectForm
          project={project}
          onCancel={cancelEditing}
          onSave={handleSave}
        />
      ) : (
        <ProjectCard project={project} onEdit={handleEdit} />
      )}
    </div>
  ));
  return <div className="row">{items}</div>;
}

export default ProjectList;

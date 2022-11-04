import React, { Component } from "react";
import "./MainContent.scss";
import "./Dashboard.scss";

import { connect } from "react-redux";

import Modal from "./Modal/Modal";

class Dashboard extends Component {
  state = {
    modal: false,
    edit: false,
    overview: false,
    name: "",
    members: [],
    id: "",
    owner: {}
  };

  toggleModal = e => {
    this.setState({ modal: !this.state.modal, edit: false, overview: false });
  };

  toggleEditModal = (name, members, id, owner, e) => {
    e.stopPropagation();

    this.setState({
      modal: !this.state.modal,
      edit: !this.state.edit,
      overview: this.state.overview,
      name: name,
      members: members,
      id: id,
      owner: owner
    });
  };

  toggleOverviewModal = (name, members, id, owner, e) => {
    e.stopPropagation();

    this.setState({
      modal: !this.state.modal,
      edit: this.state.edit,
      overview: !this.state.overview,
      name: name,
      members: members,
      id: id,
      owner: owner
    });
  };

  render() {
    const { projects } = this.props.projects;

    let content;

    let projectData = projects.sort().map(project => (
      <div
        key={project._id}
        className="project-icon"
        onClick={() => this.props.history.push(`/projects/${project._id}`)}
      >
        <div className="project-name">{project.name}</div>
        <div
          className="project-info-button"
          onClick={this.toggleOverviewModal.bind(
            this,
            project.name,
            project.teamMembers,
            project._id,
            project.owner
          )}
        >
          Overview
        </div>
        <div className="project-info-button">Go to project</div>
      </div>
    ));

    if (projects.length > 0) {
      // At least one project
      content = (
        <>
          <div className="header-container">
            <h1 className="header">Your Projects</h1>
            <button style={{marginRight: "2rem"}} className="main-btn" onClick={this.toggleModal}> 
              Create another project
            </button>
          </div>
          <div className="modal-wrapper">
            <Modal
              onClose={this.toggleModal}
              modal={this.state.modal}
              edit={this.state.edit}
              overview={this.state.overview}
              name={this.state.name}
              members={this.state.members}
              id={this.state.id}
              owner={this.state.owner}
            />
          </div>
          <div className="projects-wrapper">{projectData}</div>
        </>
      );
    } else {
      // No projects
      content = (
        <>
          <div className="projects">
            <div className="no-projects">
              {/* <h1 className="header">You have no projects</h1> */}
              <button className="main-btn" onClick={this.toggleModal}>
                Create your first project
              </button>
              <div className="modal-wrapper">
                <Modal onClose={this.toggleModal} modal={this.state.modal} />
              </div>
            </div>
          </div>
        </>
      );
    }

    return (
      <div className="main-content">
        {content}
      </div>
    );
  }
}

const mapStateToProps = state => ({
  projects: state.projects
});

export default connect(
  mapStateToProps,
  {}
)(Dashboard);

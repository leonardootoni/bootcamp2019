import React, { Component, Fragment } from 'react';
import TechItem from './TechItem';

class TechList extends Component {
  state = {
    newTech: '',
    techs: []
  };

  handleInputChange = e => {
    this.setState({ newTech: e.target.value });
  };

  handleSubmit = e => {
    e.preventDefault();
    this.setState({ techs: [...this.state.techs, this.state.newTech], newTech: '' });
  };

  handleDelete = index => {
    const techs = [...this.state.techs];
    techs.splice(index, 1);
    console.table(techs);
    this.setState({ techs });
  };

  // It will load the localStorage state, if it exist.
  componentDidMount() {
    if (localStorage.getItem('techs')) {
      this.setState({ techs: JSON.parse(localStorage.getItem('techs')) });
    }
  }

  // It checks if techs list changed before to save data in localstorage
  componentDidUpdate(_, prevState) {
    if (prevState.techs !== this.state.techs) {
      localStorage.setItem('techs', JSON.stringify(this.state.techs));
    }
  }

  render() {
    return (
      <Fragment>
        <form onSubmit={this.handleSubmit}>
          <ul>
            {this.state.techs.map((tech, index) => (
              <TechItem key={index} tech={tech} onDelete={() => this.handleDelete(index)} />
            ))}
          </ul>
          <input type='text' onChange={this.handleInputChange} value={this.state.newTech}></input>
          <button type='submit'>Submit</button>
        </form>
      </Fragment>
    );
  }
}

export default TechList;

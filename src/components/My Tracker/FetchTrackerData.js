import React, { Component } from 'react';
import axios from 'axios';
import { BASE } from '../../actions';

class FetchTrackerData extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fetch_data: []
    };
    this.clickHandler = this.clickHandler.bind(this);
  }

  componentDidMount() {
    console.log('componentDidMount');
    axios
      .get(`${BASE}/api/users/6/usertrackers/`)
      .then(responce => {
        this.setState({
          fetch_data: responce.data.data
        });
      })
      .catch(error => console.log(error));
  }

  clickHandler(e, e2) {
    const confirmData = confirm('You want to change?');
    if (confirmData === true) {
      const data = {
        isActive: `${!e2}`
      };
      axios
        .put(`${BASE}/api/trackers/${e}`, data)
        .then(response => {
          console.log(response);
          axios
            .get(`${BASE}/api/trackers/`)
            .then(responce => {
              this.setState({
                fetch_data: responce.data.data
              });
            })
            .catch(error => console.log(error));
        })
        .catch(error => {
          console.log(error);
        });
    }
  }

  createTable() {
    const table = [];
    for (let i = 0; i < this.state.fetch_data.count; i++) {
      const children = [];
      children.push(<td key={i}>Tracker {i + 1}</td>);
      children.push(<td>{this.state.fetch_data.rows[i].id}</td>);
      children.push(<td>Done</td>);
      children.push(
        <td>
          <button
            className="btn btn-primary"
            onClick={() =>
              this.clickHandler(
                this.state.fetch_data.rows[i].id,
                this.state.fetch_data.rows[i].isActive
              )
            }
          >
            {this.state.fetch_data.rows[i].isActive ? (
              <span>Active</span>
            ) : (
              <span>Inactive</span>
            )}
          </button>
        </td>
      );
      table.push(<tr>{children}</tr>);
    }
    return table;
  }

  render() {
    return (
      <div className="container col-md-11">
        <p className="text-muted">My Tracker</p>
        <table className="table table-borderless table-responsive-md table-hover">
          <thead>
            <tr>
              <th scope="col">Tracker Name</th>
              <th scope="col">Tracker ID</th>
              <th scope="col">Configuration Status</th>
              <th scope="col">Tracker Status</th>
            </tr>
          </thead>
          <tbody>{this.createTable()}</tbody>
        </table>
      </div>
    );
  }
}
export default FetchTrackerData;

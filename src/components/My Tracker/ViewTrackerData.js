import React, { Component } from 'react';
import SidebarView from '../common/SidebarView';
import NavBar from '../common/NavBar';
// import FetchTrackerData from './FetchTrackerData';
import TableData from './TableData';

class ViewTrackerData extends Component {
  render() {
    return (
      <div id="wrapper" className="toggled">
        <SidebarView selected="/my-tracker" />
        <div id="page-content-wrapper " className="">
          <NavBar />
        </div>
        <div className="container-fluid">
          <h1>View Tracker Data</h1>
          <TableData />
        </div>
      </div>
    );
  }
}
export default ViewTrackerData;

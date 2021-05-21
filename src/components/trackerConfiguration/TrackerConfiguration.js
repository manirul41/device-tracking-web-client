import React, { Component } from 'react';
import SidebarView from '../common/SidebarView';
//import UserTrackerView from './map/UserTrackerView';
import NavBar from '../common/NavBar';
import { LOCAL_STORAGE_DATA_KEYNAME } from '../../actions/types';
import ViewTrackers from "./tasks/ViewTrackers";

class TrackerConfiguration extends Component {
    render() {
        //const userLocalData = JSON.parse(localStorage.getItem(LOCAL_STORAGE_DATA_KEYNAME));
        return (
            <div id="wrapper" className="toggled">
                <SidebarView selected="/configure-tracker" />
                <div id="page-content-wrapper " className="">
                    <NavBar />
                    <div className="container-fluid">
                        <h1>TrackerConfiguration</h1>
                        <ViewTrackers />
                    </div>
                </div>
            </div>
        );
    }
}

export default TrackerConfiguration;

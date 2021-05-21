import React, {Component} from 'react';
import SidebarView from '../common/SidebarView';
import NavBar from '../common/NavBar';
import FetchHealthData from './FetchHealthData';

// import TrackerSelect from '../common/TrackerSelect';


class ViewHealth extends Component {
    render() {
        return (
            <div id="wrapper" className="toggled">
                <SidebarView selected="/health"/>
                <div id="page-content-wrapper " className="">
                    <NavBar/>
                </div>
                <div className="container-fluid">
                    <h1>View Health</h1>
                    {/* <TrackerSelect /> */}
                    <FetchHealthData/>

                </div>
            </div>
        );
    }
}

export default ViewHealth;

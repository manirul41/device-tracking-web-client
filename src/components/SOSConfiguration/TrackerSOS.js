import React, {Component} from 'react';
import NavBar from "../common/NavBar";
import SidebarView from "../common/SidebarView";
import TrackerSOSList from "./tasks/TrackerSOSList";

class TrackerSos extends Component {
    render() {
        return (
            <div id="wrapper" className="toggled">
                <SidebarView selected="/sos-number"/>
                <div id="page-content-wrapper " className="">
                    <NavBar/>
                    <div className="container-fluid">
                        <h1>Product Page</h1>
                        <div className="row">
                            <div className="col-sm-12">
                                <TrackerSOSList/>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default TrackerSos;

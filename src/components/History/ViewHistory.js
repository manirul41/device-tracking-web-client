import React, {Component} from 'react';
import SidebarView from '../common/SidebarView';
import NavBar from '../common/NavBar';
import TrackerSelect from './TrackerSelect';


class ViewHistory extends Component {
    constructor(props) {
        super(props);
        this.state = {
            id: null,
            name: null
        };
    }

    render() {
        return (
            <div id="wrapper" className="toggled">
                <SidebarView selected="/history"/>
                <div id="page-content-wrapper " className="">
                    <NavBar/>
                </div>
                <div className="container-fluid"><h1>View History</h1>
                    <TrackerSelect/>
                </div>
            </div>
        );
    }
}

export default ViewHistory;

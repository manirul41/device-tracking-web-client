import React, { Component } from 'react';
import SidebarView from '../common/SidebarView';
import NavBar from '../common/NavBar';
import TrackerSelection from './task/TrackerSelection';

const initialState = {
    //isView: true,
};

class Report extends Component {
    constructor(props) {
        super(props);
        this.state = {
            ...initialState
        };
    }

    render() {
        return (
            <div id="wrapper" className="toggled">
                <SidebarView selected="/report" />
                <div id="page-content-wrapper " className="">
                    <NavBar />
                    <div className="container-fluid ">
                        <h1>Report</h1>
                        <TrackerSelection />
                    </div>
                </div>
            </div>
        );
    }
}

export default Report;

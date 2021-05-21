import React, { Component } from 'react';
import { connect } from 'react-redux';
import Select from 'react-select';
import SingleTrackerMap from './SingleTrackerMap';
import { getUserTrackers } from '../../actions/tracker';
import { LOCAL_STORAGE_DATA_KEYNAME } from '../../actions/types';
import ReactLoading from 'react-loading';
import axios from "axios";
import {BASE} from "../../actions";
import ErrorMessage from "../common/errors/ErrorMessage";

let CreateError = '';
let CreateSuccess = '';

class UserTrackerView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            userRole: '',
            editorValue: '<p>Please Select User Role First</p>',
            isLoadTracker: false,
            TrackerData: [],
            isSelectSingleTracker: false,
            trackerId: 'Not Initialized',
            initialValue: 0,
            isInitialValue: true,
            trackerName: '',
            trackerRow: '',
            show: true,
            isCreateError: false,
            isSuccessCreate: false,
        };
        this.handleChangeFrom = this.handleChangeFrom.bind(this);
        this.handleTrackerOption = this.handleTrackerOption.bind(this);
    }

    componentDidMount() {
        const userLocalData = JSON.parse(localStorage.getItem(LOCAL_STORAGE_DATA_KEYNAME));
        if (userLocalData != null) {
            const request =  this.props.getUserTrackers(userLocalData.user.id);

            request.then(
                () => {

                }
            ).catch(
                () => {

                    const req = axios.get(`${BASE}/api/users/${userLocalData.user.id}/usertrackers/?include={"model": "Tracker", "as": "tracker", "include":[{"model":"TrackerConfiguration", "as":"trackerConfiguration"},{"model":"TrackerSOSNumber", "as":"trackerSOSNumbers", "include":{"model":"PhoneNumber", "as":"phoneNumber"}}]}`)
                    .then( () => {

                    }).catch (
                        (error) => {
                            if (error.response.data.errors.length > 0) {
                                // CreateError = error.response.data.errors[0].msg;
                                CreateError = `${error.response.data.message + " " + error.response.data.errors[0].msg}`;
                                this.setState({
                                    isCreateError: true,
                                });
                            }
                    });
                }
            );
        }
    }

    handleTrackerOption() {
        const sliced = [];
        if (this.state.TrackerData.length <= 0) {
            console.log('handleTrackerOption',this.props.singleUserTrackers);
            for (let i = 0; i < this.props.singleUserTrackers.rows.length; i++) {
                sliced.push({
                    value: this.props.singleUserTrackers.rows[i].trackerId,
                    label: this.props.singleUserTrackers.rows[i].tracker.trackerConfiguration != null ? this.props.singleUserTrackers.rows[i].tracker.trackerConfiguration.givenName : `'Tracker' ${i}`,
                    row: this.props.singleUserTrackers.rows[i]
                });
            }
            sliced.push({
                value: 0,
                label: "ALL Tracker",
                row: '',
            });
            //this.setState({ isLoadTracker: true });
        }
        //console.log(sliced);
        return sliced;
    }

    handleChangeFrom(obj) {
        console.log('handleChangeFrom', obj);
        this.setState({ trackerId: obj.value, isSelectSingleTracker: true, initialValue: obj.value, trackerName: obj.label, trackerRow: obj.row });
    }
    render() {

        if (this.state.isCreateError === true){
            return <ErrorMessage CreateError={CreateError} isCreateError={this.state.isCreateError}
                          handleCreateError={this.handleCreateError}/>;
        }

        if (this.props.singleUserTrackers == null) {
            return <ReactLoading className='relaod-logo-css' type="spinningBubbles" color="#aaaaaa" height={50} width={50} />;
        }
        //console.log("UserTrackers", this.props.singleUserTrackers.UserTrackers.rows);
        return (
            <div className="col-12 mt-4">
                <div className="row justify-content-center">
                    <p className="lead text-center pl-0  mt-1 pr-1">
                        <b>Tracker :</b>
                    </p>
                    <div className="col-4 pl-0">
                        <Select
                            placeholder={
                                <span className="text-primary">Select Tracker</span>
                            }
                            options={this.handleTrackerOption()}
                            //value={this.props.roles}
                            onChange={this.handleChangeFrom}
                        />
                    </div>
                </div>

                {/*{ this.state.isSelectSingleTracker &&*/}
                    {/*<SingleTrackerMap mapData={this.state.initialValue} />*/}
                {/*}*/}

                <SingleTrackerMap
                    trackerName={this.state.initialValue > 0 ? this.state.trackerName : ''}
                    trackerRow={this.state.initialValue > 0 ? this.state.trackerRow : ''}
                    mapData={this.state.initialValue}
                />


            </div>
        );
    }
}

function mapStateToProps(state) {
    console.log('Dashboard------', state.tracker);
    return {
        singleUserTrackers: state.tracker.UserTrackers
    };
}

export default connect(mapStateToProps, { getUserTrackers })(UserTrackerView);

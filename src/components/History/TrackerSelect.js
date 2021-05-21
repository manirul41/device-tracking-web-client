import React, {Component} from 'react';
import {connect} from 'react-redux';
import Select from 'react-select';
import Helmet from 'react-helmet';
import moment from 'moment';
import DayPickerInput from 'react-day-picker/DayPickerInput';
import 'react-day-picker/lib/style.css';
import {formatDate, parseDate} from 'react-day-picker/moment';
import {getUserTrackers} from '../../actions/tracker';
import {LOCAL_STORAGE_DATA_KEYNAME} from '../../actions/types';
import FetchHistoryData from './FetchHistoryData';
import ReactLoading from "react-loading";
import axios from "axios";
import {BASE} from "../../actions";
import ErrorMessage from "../common/errors/ErrorMessage";

let CreateError = '';
let CreateSuccess = '';

class TrackerSelect extends Component {
    constructor(props) {
        super(props);
        this.state = {
            TrackerData: [],
            isSelected: false,
            trackerId: null,
            trackerIdAll: [],
            trackerNameAll: [],
            trackerName: null,
            from: '',
            to: moment().add(1, "day").toDate()
        };
        this.handleTrackerOption = this.handleTrackerOption.bind(this);
        this.handleChangeFrom = this.handleChangeFrom.bind(this);
        this.handleChangeDate = this.handleChangeDate.bind(this);
        this.handleFromChange = this.handleFromChange.bind(this);
        this.handleToChange = this.handleToChange.bind(this);
    }

    componentDidMount() {
        const userLocalData = JSON.parse(
            localStorage.getItem(LOCAL_STORAGE_DATA_KEYNAME)
        );
        if (userLocalData != null) {
            //this.props.getUserTrackers(userLocalData.user.id);
            const request = this.props.getUserTrackers(userLocalData.user.id);

            request.then(
                () => {
                }
            ).catch(
                () => {

                    const req = axios.get(`${BASE}/api/users/${userLocalData.user.id}/usertrackers/?include={"model": "Tracker", "as": "tracker", "include":[{"model":"TrackerConfiguration", "as":"trackerConfiguration"},{"model":"TrackerSOSNumber", "as":"trackerSOSNumbers", "include":{"model":"PhoneNumber", "as":"phoneNumber"}}]}`)
                        .then(() => {

                        }).catch((error) => {
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

    // ----------------------For date picking handler
    showFromMonth() {
        const {from, to} = this.state;
        if (!from) {
            return;
        }
        if (moment(to).diff(moment(from), 'months') < 2) {
            this.to.getDayPicker().showMonth(from);
        }
    }

    handleFromChange(from) {
        // Change the from date and focus the "to" input field
        this.setState({from});
    }

    handleToChange(to) {
        this.setState({to}, this.showFromMonth);
    }

    //-------------------change handler for select-----------
    handleTrackerOption() {
        const sliced = [];
        const id = [];
        const name = [];
        if (this.state.TrackerData.length <= 0) {
            for (
                let i = 0;
                i < this.props.singleUserTrackers.rows.length;
                i++
            ) {
                sliced.push({
                    value: this.props.singleUserTrackers.rows[i].trackerId,
                    label:
                        this.props.singleUserTrackers.rows[i].tracker
                            .trackerConfiguration != null
                            ? this.props.singleUserTrackers.rows[i].tracker
                                .trackerConfiguration.givenName
                            : `'Tracker' ${i}`
                });
                id.push(this.props.singleUserTrackers.rows[i].trackerId);
            }
        }
        name.push(sliced);
        if (this.state.trackerIdAll.length === 0) {
            this.setState({
                trackerIdAll: id
            });
        }
        if (this.state.trackerNameAll.length === 0) {
            this.setState({
                trackerNameAll: name
            });
        }
        return sliced;
    }

    handleChangeFrom(obj) {
        this.setState({
            trackerId: obj.value,
            trackerName: obj.label,
            isSelected: true
        });
    }

    handleChangeDate(date) {
        this.setState({
            startDate: date
        });
    }

    render() {
        const {from, to} = this.state;
        const modifiers = {start: from, end: to};

        if (this.state.isCreateError === true) {
            return <ErrorMessage CreateError={CreateError} isCreateError={this.state.isCreateError}
                                 handleCreateError={this.handleCreateError}/>;
        }

        if (this.props.singleUserTrackers === null) {
            return <ReactLoading className='relaod-logo-css' type="spinningBubbles" color="#aaaaaa" height={50}
                                 width={50}/>;
        }
        return (
            <div className="container mt-4">
                <div className="justify-content-center">
                    <nav className="navbar navbar-expand-lg navbar-light bg-light justify-content-center">
                        <div className="col-4 pl-0 justify-content-center">
                            <Select

                                placeholder={
                                    <span className="text-primary">Select Tracker</span>
                                }
                                options={this.handleTrackerOption()}
                                //value={this.props.roles}
                                onChange={this.handleChangeFrom}
                            />
                        </div>
                        <span>Start Date:  </span>
                        <div className="InputFromTo">
                            <DayPickerInput
                                value={from}
                                placeholder=" Start Date "
                                format="LL"
                                formatDate={formatDate}
                                parseDate={parseDate}
                                dayPickerProps={{
                                    selectedDays: [from, {from, to}],
                                    disabledDays: {after: to},
                                    toMonth: to,
                                    modifiers,
                                    numberOfMonths: 2,
                                    onDayClick: () => this.to.getInput().focus(),
                                }}
                                onDayChange={this.handleFromChange}
                            />
                            {' '}—{' '}<span>End Date:  </span><span className="InputFromTo-to">
                            <DayPickerInput
                                ref={el => (this.to = el)}
                                value={to}
                                placeholder=" End Date "
                                format="LL"
                                formatDate={formatDate}
                                parseDate={parseDate}
                                dayPickerProps={{
                                    selectedDays: [from, {from, to}],
                                    disabledDays: {before: from},
                                    modifiers,
                                    month: from,
                                    fromMonth: from,
                                    numberOfMonths: 2,
                                }}
                                onDayChange={this.handleToChange}
                            />
                        </span>
                            <Helmet>
                                <style>{`.InputFromTo .DayPicker-Day--selected:not(.DayPicker-Day--start):not(.DayPicker-Day--end):not(.DayPicker-Day--outside) {
                                  background-color: #f0f8ff !important;
                                  color: #4a90e2;
                                }
                                .InputFromTo .DayPicker-Day {
                                  border-radius: 0 !important;
                                }
                                .InputFromTo .DayPicker-Day--start {
                                  border-top-left-radius: 50% !important;
                                  border-bottom-left-radius: 50% !important;
                                }
                                .InputFromTo .DayPicker-Day--end {
                                  border-top-right-radius: 50% !important;
                                  border-bottom-right-radius: 50% !important;
                                }
                                .InputFromTo .DayPickerInput-Overlay {
                                  width: 550px;
                                }
                                .InputFromTo-to .DayPickerInput-Overlay {
                                  margin-left: -198px;
                                }
                              `}</style>
                            </Helmet>
                        </div>
                    </nav>
                </div>

                {(!this.state.isSelected) &&
                <FetchHistoryData
                    id={this.state.trackerIdAll}
                    name={this.state.trackerNameAll}
                    startDate={moment(this.state.from).format('YYYY-MM-DD')}
                    endDate={moment(this.state.to).format('YYYY-MM-DD')}
                />}
                {this.state.isSelected &&
                <FetchHistoryData
                    id={this.state.trackerId}
                    name={this.state.trackerName}
                    startDate={moment(this.state.from).format('YYYY-MM-DD')}
                    endDate={moment(this.state.to).format('YYYY-MM-DD')}
                />}
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        singleUserTrackers: state.tracker.UserTrackers
    };
}

export default connect(
    mapStateToProps,
    {getUserTrackers}
)(TrackerSelect);

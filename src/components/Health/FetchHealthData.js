import React, {Component} from 'react';
import {connect} from 'react-redux';
import Moment from 'react-moment';
import {getTrackersHealth, getUserTrackers} from '../../actions/tracker';
import {LOCAL_STORAGE_DATA_KEYNAME} from '../../actions/types';
import {isEmpty} from "lodash";
import axios from "axios";
import {BASE} from "../../actions";
import ErrorMessage from "../common/errors/ErrorMessage";
import ReactLoading from 'react-loading';
import Pagination from "react-bootstrap/Pagination";

let filteredData = [];
let dataUserInit = [];

let page_per_content = 100;

let CreateError = '';
let CreateSuccess = '';

class FetchHealthData extends Component {
    constructor(props) {
        super(props);
        this.state = {
            show: true,
            isCreateError: false,
            isSuccessCreate: false,dataUser: [],
            isLoadData: '',
            active: 1,
        };
        this.renderPerPageRows = this.renderPerPageRows.bind(this)
        this.onChangePage = this.onChangePage.bind(this)
        this.paginationBasic = this.paginationBasic.bind(this)
    }

    checkNullLocation(value) {
        if (isEmpty(value) === false && JSON.parse(value).length === 2) {
            const result = JSON.parse(value);
            return (
                <div>
                    ({result[0]}, {result[1]})
                    <a href={`https://www.google.com/maps/search/?api=1&query=${result}`} target="_blank"> See On
                        Map</a>
                </div>);
        } else {
            return "Null";
        }
    }

    componentDidMount() {
        const userLocalData = JSON.parse(localStorage.getItem(LOCAL_STORAGE_DATA_KEYNAME));
        let trackerId = [];
        const request = this.props.getUserTrackers(userLocalData.user.id);
        request.then(
            response => {
                for (let i = 0; i < response.payload.data.data.rows.length; i++) {
                    trackerId.push(response.payload.data.data.rows[i].trackerId);
                }
                this.props.getTrackersHealth(trackerId).then(
                    response => {
                        console.log('user data parsing////', response.payload.data.data.rows);
                        let resData = response.payload.data.data.rows;
                        dataUserInit = resData;
                        filteredData = resData;
                        this.setState({
                            dataUser: resData
                        });
                        //console.log(resData);

                    }
                ).catch(
                    (e) => {
                        console.log("Opps! undefined error", e);
                    }
                );
            }
        ).catch(
            error => {
                console.log('--- Error ---', error, error.response);
                const req = axios.get(`${BASE}/api/users/${userLocalData.user.id}/usertrackers/?include={"model": "Tracker", "as": "tracker", "include":[{"model":"TrackerConfiguration", "as":"trackerConfiguration"},{"model":"TrackerSOSNumber", "as":"trackerSOSNumbers", "include":{"model":"PhoneNumber", "as":"phoneNumber"}}]}`)
                    .then(() => {

                    }).catch(
                        (error) => {
                            if (error.response.data.errors.length > 0) {
                                // CreateError = error.response.data.errors[0].msg;
                                CreateError = `${error.response.data.message + " " + error.response.data.errors[0].msg}`;
                                this.setState({
                                    isCreateError: true,
                                });
                            }
                        });
            });
    }

    onChangePage(value) {
        this.setState({
            active: value
        })
    }

    paginationBasic() {

        let items = [];
        let pagination_length = Math.ceil(filteredData.length / page_per_content);

        for (let number = 1; number <= pagination_length; number++) {
            items.push(
                <Pagination.Item key={number} onClick={() => this.onChangePage(number)}
                                 active={number === this.state.active}>
                    {number}
                </Pagination.Item>,
            );
        }
        return <Pagination size="sm">{items}</Pagination>;
    }

    renderPerPageRows() {
        let ordered_list = _.orderBy(filteredData, ['date'], ['desc']);
        let list = ordered_list.slice((this.state.active - 1) * page_per_content, this.state.active * page_per_content);
        //console.log(filteredData);
        return _.map(list, row => {
            return (
                <tr key={row.id}>
                    <td>{row.trackerId}</td>
                    <td style={{width: 50}}>
                        {this.checkNullLocation(row.coordinates)}
                    </td>
                    <td>{row.positionStatus.status}</td>
                    <td>
                        <div><Moment format="MMMM DD,YYYY">{row.positionStatus.updatedAt}</Moment></div>
                        <div><Moment format="LT">{row.positionStatus.updatedAt}</Moment></div>
                    </td>
                </tr>
            );
        });
    }

    render() {
        if (this.state.isCreateError === true) {
            return <ErrorMessage CreateError={CreateError} isCreateError={this.state.isCreateError}
                                 handleCreateError={this.handleCreateError}/>;
        }

        if (this.state.dataUser.length === 0) {
            return <ReactLoading className='relaod-logo-css' type="spinningBubbles" color="#aaaaaa" height={50}
                                 width={50}/>;
        }
        return (
            <div>
                <h3>My Trackers Health Data</h3>
                <table className="table table-borderless table-responsive-md table-hover">
                    <thead className="bg-primary text-white">
                    <tr>
                        <th style={{width: 20}}>Tracker Id</th>
                        <th style={{width: 20}}>Position Status</th>
                        <th style={{width: 20}}>Tracker Status</th>
                        <th style={{width: 20}}>Date-Time Status</th>
                    </tr>
                    </thead>
                    <tbody>
                        {this.state.dataUser.length > 0 && this.renderPerPageRows()}
                    </tbody>
                </table>
                <div className="d-flex flex-wrap">
                    {this.state.dataUser.length > 0 && this.paginationBasic()}
                </div>
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        trackerHealth: state.tracker
    };
}

export default connect(mapStateToProps, {getTrackersHealth, getUserTrackers})(FetchHealthData);

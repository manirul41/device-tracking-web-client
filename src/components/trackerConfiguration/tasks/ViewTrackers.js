import React, {Component} from 'react';
import EditTrackerConfiguration from "./EditTrackerConfiguration";
import {getUserTrackers} from '../../../actions/tracker';
import {LOCAL_STORAGE_DATA_KEYNAME} from "../../../actions/types";
import {connect} from "react-redux";
import ReactLoading from 'react-loading';
import axios from "axios";
import {BASE} from "../../../actions";
import ErrorMessage from "../../common/errors/ErrorMessage";
import Pagination from "react-bootstrap/Pagination";

let CreateError = '';
let CreateSuccess = '';

let filteredData = [];
let dataUserInit = [];

let page_per_content = 10;

class ViewTrackers extends Component {
    constructor(props) {
        super(props);
        this.state = {
            activePage: 1,
            isViewTracker: true,
            tracker: null,
            show: true,
            isCreateError: false,
            isSuccessCreate: false,
            dataUser: [],
            isLoadData: '',
            active: 1,
        };
        this.editTracker = this.editTracker.bind(this);
        this.veiwTracker = this.veiwTracker.bind(this);
        this.renderPerPageRows = this.renderPerPageRows.bind(this)
        this.onChangePage = this.onChangePage.bind(this)
        this.paginationBasic = this.paginationBasic.bind(this)
    }

    componentDidMount() {
        const userLocalData = JSON.parse(localStorage.getItem(LOCAL_STORAGE_DATA_KEYNAME));
        if (userLocalData != null) {
            const request = this.props.getUserTrackers(userLocalData.user.id);

            request.then(
                response => {
                    //console.log('user data parsing', response.payload.data.data.rows);
                    let resData = response.payload.data.data.rows;
                    dataUserInit = resData;
                    filteredData = resData;
                    this.setState({
                        dataUser: resData
                    });
                    //console.log(resData);
                }
            ).catch(
                () => {

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
                }
            );
        }
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

    componentDidUpdate(prevProps) {
        // Typical usage (don't forget to compare props):
        console.log('componentDidUpdate from view tracker--', prevProps);
        // if (this.props.singleUserTrackers.UserTrackers.rows.length !== prevProps.userID) {
        //     this.fetchData(this.props.userID);
        // }
    }

    editTracker(tracker) {
        //e.preventDefault();
        console.log('editTracker', tracker);
        this.setState({isViewTracker: false, tracker: tracker});
    }

    veiwTracker() {
        //e.preventDefault();
        console.log('viewTracker');
        this.setState({isViewTracker: true});
    }

    renderPerPageRows() {
        let ordered_list = _.orderBy(filteredData, ['trackerId'], ['desc']);
        let list = ordered_list.slice((this.state.active - 1) * page_per_content, this.state.active * page_per_content);
        //console.log(filteredData);
        return _.map(list, row => {
            return (
                <tr key={row.id}>
                    <th> {row.tracker.trackerConfiguration != null ? row.tracker.trackerConfiguration.givenName : row.tracker.name} </th>
                    <td> {row.tracker.id} </td>
                    <td> {row.tracker.trackerConfiguration != null ? 'DONE' : 'PENDING'} </td>
                    <td>
                        {
                            row.tracker.trackerConfiguration != null
                                ? <span onClick={() => this.editTracker(row.tracker)}
                                        className="col-md-6 btn btn-primary">Edit</span>
                                : <span onClick={() => this.editTracker(row.tracker)}
                                        className="col-md-6 btn btn-danger">CONFIGURE</span>
                        }
                    </td>
                </tr>
            );
        });
    }

    render() {
        console.log('ViewTracker  ==== ', this.props);
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
                {this.state.isViewTracker &&
                <div>
                    <h3>Tracker List</h3>
                    <div className="table-responsive">
                        <table className="table">
                            <thead className="bg-primary text-white">
                            <tr>
                                <th scope="col">Tracker Name</th>
                                <th scope="col">Tracker ID</th>
                                <th scope="col">Configuration Status</th>
                                <th scope="col">Action</th>
                            </tr>
                            </thead>
                            <tbody>
                            {this.state.dataUser.length > 0 && this.renderPerPageRows()}
                            </tbody>
                        </table>
                        <div className="d-flex flex-wrap">
                            {this.state.dataUser.length > 0 && this.paginationBasic()}
                        </div>
                        <hr/>
                    </div>
                </div>
                }
                {this.state.isViewTracker === false &&
                <EditTrackerConfiguration tracker={this.state.tracker} veiwTracker={this.veiwTracker}/>}
            </div>
        );
    }
}

// function mapStateToProps(state) {
//     console.log('ViewTrackers promotion === ', state);
//     return {
//         singleUserTrackers: state.tracker
//     };
// }

export default connect(null, {getUserTrackers})(ViewTrackers);

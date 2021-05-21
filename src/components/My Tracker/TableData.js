import React, {Component, Fragment} from 'react';
import {connect} from 'react-redux';
import {getUserTrackers, setTrackerActive} from '../../actions/tracker';
import {LOCAL_STORAGE_DATA_KEYNAME} from '../../actions/types';
import axios from "axios";
import {BASE} from "../../actions";
import ErrorMessageModal from "../common/errors/ErrorMessageModal";
import ReactLoading from 'react-loading';
import Pagination from "react-bootstrap/Pagination";
import Modal from "react-bootstrap/Modal";
import {Redirect} from "react-router";
import SuccessMessage from "../common/errors/SuccessMessage";

let CreateError = '';
let CreateSuccess = '';

let filteredData = [];
let dataUserInit = [];

let page_per_content = 10;

class TableData extends Component {
    constructor(props) {
        super(props);
        this.state = {
            TrackerData: [],
            isActive: null,
            id: null,
            show: true,
            isCreateError: false,
            isSuccessCreate: false,
            dataUser: [],
            isLoadData: '',
            active: 1,
            isSetUpdateRowData: false,
            setUpdateRowData: '',
            isRedirect: false,
        };
        this.renderPerPageRows = this.renderPerPageRows.bind(this)
        this.onChangePage = this.onChangePage.bind(this)
        this.paginationBasic = this.paginationBasic.bind(this)
        this.onClickSetUpdateHandler = this.onClickSetUpdateHandler.bind(this)
        this.handleClose = this.handleClose.bind(this)
        this.onClickUpdateHandler = this.onClickUpdateHandler.bind(this)
        this.handleSuccessMessage = this.handleSuccessMessage.bind(this)
        this.handleCreateError = this.handleCreateError.bind(this)
    }

    componentDidMount() {
        const userLocalData = JSON.parse(
            localStorage.getItem(LOCAL_STORAGE_DATA_KEYNAME)
        );
        this.setState({
            id: userLocalData.user.id
        });
        if (userLocalData != null) {
            //this.props.getUserTrackers(userLocalData.user.id);
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


    onClickSetUpdateHandler(value) {
        this.setState({
            setUpdateRowData: value,
            isSetUpdateRowData: true
        });
    }

    handleClose() {
        this.setState({
            isSetUpdateRowData: false,
            setUpdateRowData: '',
            isSuccessCreate: false,
        });
    }

    onClickUpdateHandler(value) {
        //console.log(this.state)

        if (value === 1) {
            const data = {
                isActive: `${!this.state.setUpdateRowData.tracker.isActive}`
            };

            const request = this.props.setTrackerActive(data, this.state.setUpdateRowData.trackerId);
            request.then(response => {
                CreateSuccess = response.payload.data.message;
                this.setState({
                    show: true,
                    isSetUpdateRowData: false,
                    setUpdateRowData: '',
                    isCreateError: false,
                    isSuccessCreate: true,
                })
                CreateError = '';
                //CreateSuccess = '';

            }).catch(error => {
                //console.log(error.response.data.message)
                CreateError = "Tracker reference not found";
                this.setState({
                    show: true,
                    isSetUpdateRowData: false,
                    setUpdateRowData: '',
                    isCreateError: true,
                    isSuccessCreate: false,
                });
                // if (error.response.data.errors.length > 0) {
                //     CreateError = `${error.response.data.message + " " + error.response.data.errors[0].msg}`;
                //     this.setState({
                //         type: '',
                //         isCreateError: true,
                //     });
                // } else {
                //     CreateError = error.response.data.message
                // }
            })
        }
        if (value === 2) {
            return this.handleClose();
        }
    }

    handleSuccessMessage() {
        this.setState({
            isSuccessCreate: !this.state.isSuccessCreate,
            isRedirect: true,
        })
    }

    handleCreateError() {
        this.setState({
            isCreateError: !this.state.isCreateError,
            //isRedirect: true,
        })
    }

    renderPerPageRows() {
        let ordered_list = _.orderBy(filteredData, ['trackerId'], ['desc']);
        let list = ordered_list.slice((this.state.active - 1) * page_per_content, this.state.active * page_per_content);
        //console.log(filteredData);
        return _.map(list, row => {
            return (
                <tr key={row.id}>
                    <th scope="row">
                        {row.tracker
                            .trackerConfiguration != null
                            ? row.tracker
                                .trackerConfiguration.givenName
                            : `Tracker ${row.trackerId}`}
                    </th>
                    <td>{row.trackerId}</td>
                    <td>
                        {row.tracker.isActive ? (
                            <span className="btn btn-primary" onClick={() => this.onClickSetUpdateHandler(row)}>Deactivate</span>
                        ) : (
                            <span
                                className="btn btn-danger"
                                onClick={() => this.onClickSetUpdateHandler(row)}
                            >
                                Activate
                            </span>
                        )}
                    </td>
                </tr>
            );
        });
    }

    render() {
        if (this.state.isRedirect) {
            return (<Redirect to={'/my-tracker'} />);
        }

        if (this.state.dataUser.length === 0) {
            return <ReactLoading className='relaod-logo-css' type="spinningBubbles" color="#aaaaaa" height={50}
                                 width={50}/>;
        }
        return (
            <Fragment>
                {this.state.isSetUpdateRowData &&
                <Modal className="mt-5" show={this.state.show} onHide={this.handleClose}>
                    <Modal.Body className="p-5">
                        <div className="d-flex flex-column align-items-center">
                            <label>Are You Update Tracker Status?</label>
                            <i className="far fa-times-circle fa-2x" style={{color: 'red'}}/>
                            <div className="d-flex flex-row align-content-between pt-2">
                                <span onClick={() => this.onClickUpdateHandler(1)}
                                      className="btn btn-danger btn-sm col-md-6 mr-1">Update</span>
                                <span onClick={() => this.onClickUpdateHandler(2)}
                                      className="btn btn-primary btn-sm col-md-6 ml-1">Cancel</span>
                            </div>
                        </div>
                    </Modal.Body>
                </Modal>}
                {this.state.isSuccessCreate &&
                <SuccessMessage
                    CreateSuccess={CreateSuccess}
                    isCreateSuccess={this.state.isSuccessCreate}
                    handleSuccessMessage={this.handleSuccessMessage}
                    />
                }

                {this.state.isCreateError &&
                <ErrorMessageModal
                    CreateError={CreateError}
                    isCreateError={this.state.isCreateError}
                    handleCreateError={this.handleCreateError}/>
                }
                <div className="col-md-12">
                    <h3>My Tracker</h3>
                    <table className="table table-borderless text-center table-responsive-md table-hover">
                        <thead className="bg-primary text-white">
                        <tr>
                            <th scope="col">Tracker Name</th>
                            <th scope="col">Tracker ID</th>
                            {/*<th scope="col">Configuration Status</th>*/}
                            <th scope="col">Tracker Status</th>
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
            </Fragment>
        );
    }
}

function mapStateToProps(state) {
    //console.log('Table Data..............', state.tracker);
    return {
        singleUserTrackers: state.tracker
    };
}

export default connect(
    mapStateToProps,
    {getUserTrackers, setTrackerActive}
)(TableData);

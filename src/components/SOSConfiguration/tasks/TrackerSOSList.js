import React, {Component, Fragment} from 'react';
import {connect} from 'react-redux';
import Table from "react-bootstrap/Table";
import ReactLoading from "react-loading";
import {Redirect} from "react-router";
import {getAppConfigurationData, getNearestPoliceStationData, getUserTrackers} from '../../../actions/tracker'
import {getFAQs} from '../../../actions/issue'
import Pagination from "react-bootstrap/Pagination";
import {LOCAL_STORAGE_DATA_KEYNAME} from "../../../actions/types";
import Modal from "react-bootstrap/Modal";
import ErrorMessageModal from "../../common/errors/ErrorMessageModal";
import ErrorMessage from "../../common/errors/ErrorMessage";
import axios from "axios";
import {BASE} from "../../../actions";

const initialState = {
    isShowInvoice: false,
    configDay: null,
    dataUser: [],
    dataNationalSOSData: '',
    isLoadData: '',
    active: 1,
    show: false,
    rowData: '',
    dataPoliceStationData: '',
    isCreateError: false,
};

let CreateError = '';
let CreateSuccess = '';

let filteredData = [];
let dataUserInit = [];

let page_per_content = 10;

class TrackerSOSList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            ...initialState
        };
        this.showInvoice = this.showInvoice.bind(this);
        this.hideInvoice = this.hideInvoice.bind(this);
        this.renderPerPageRows = this.renderPerPageRows.bind(this);
        this.renderModalPerPageRows = this.renderModalPerPageRows.bind(this);
        this.renderPoliceStationModalPerPageRows = this.renderPoliceStationModalPerPageRows.bind(this);
        this.onChangePage = this.onChangePage.bind(this)
        this.paginationBasic = this.paginationBasic.bind(this)
        this.handleEmergencyNumber = this.handleEmergencyNumber.bind(this)
        this.handleSOSNumber = this.handleSOSNumber.bind(this)
        this.handleNearestPoliceStation = this.handleNearestPoliceStation.bind(this)
        this.renderNationalSOSModalPerPageRows = this.renderNationalSOSModalPerPageRows.bind(this)
        this.handleClose = this.handleClose.bind(this)
        this.handleCreateError = this.handleCreateError.bind(this)
    }

    componentDidMount() {

        const userLocalData = JSON.parse(
            localStorage.getItem(LOCAL_STORAGE_DATA_KEYNAME)
        );
        if (userLocalData != null) {
            this.props.getUserTrackers(userLocalData.user.id).then(
                response => {
                    console.log('user data parsing---Tracker', response.payload.data.data.rows);
                    let resData = response.payload.data.data.rows;
                    // let slice = [];
                    //
                    // _.map(resData, row => {
                    //     if (row.userRoles.length !== 0 && row.subscriptionInvoices.length > 0) {
                    //         return slice.push(row);
                    //     }
                    // });
                    // //dataUserInit = resData;
                    filteredData = resData;
                    this.setState({
                        dataUser: resData
                    });

                }).catch(
                error => {
                    //console.log('--- Error ---', error, error.response);
                    // axios.get(`${BASE}/api/users/${userLocalData.user.id}/usertrackers/?include={"model": "Tracker", "as": "tracker", "include":[{"model":"TrackerConfiguration", "as":"trackerConfiguration"},{"model":"TrackerSOSNumber", "as":"trackerSOSNumbers", "include":{"model":"PhoneNumber", "as":"phoneNumber"}}]}`)
                    //     .then(() => {
                    //
                    //     }).catch(
                    //         (error) => {
                    //             if (error.response.data.errors.length > 0) {
                    //                 // CreateError = error.response.data.errors[0].msg;
                    //                 CreateError = `${error.response.data.message + " " + error.response.data.errors[0].msg}`;
                    //                 this.setState({
                    //                     isCreateError: true,
                    //                 });
                    //             }
                    //         });
                    if (error.response.data.errors.length > 0) {
                        CreateError = `${error.response.data.message + " " + error.response.data.errors[0].msg}`;
                        this.setState({
                            isCreateError: true,
                        });
                    }else{
                        CreateError = error.response.data.message;
                        this.setState({
                            isCreateError: true,
                        });
                    }
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

    showInvoice(value) {
        console.log('showInvoice Called!!', value);
        // this.setState({
        //     isShowInvoice: true
        // })
    };

    handleClose() {
        this.setState({
            show: false,
            rowData: '',
            dataPoliceStationData: '',
            dataNationalSOSData: ''
        })
    }

    handleCreateError() {
        this.setState({
            isCreateError: !this.state.isCreateError,
        })
    }

    handleEmergencyNumber(value) {
        console.log("value", value);
        this.props.getFAQs().then(
            response => {
                console.log('nationalSOS data parsing---+', response.payload.data.data.nationalSOS);
                let resData = response.payload.data.data.nationalSOS[0];
                this.setState({
                    dataNationalSOSData: resData,
                    show: true
                });

            }).catch(
            error => {
                if (error.response.data.errors.length > 0) {
                    CreateError = `${error.response.data.message + " " + error.response.data.errors[0].msg}`;
                    this.setState({
                        isCreateError: true,
                    });
                } else {
                    CreateError = error.response.data.message;
                    this.setState({
                        isCreateError: true,
                    });
                }
            }
        );
        // this.props.getAppConfigurationData().then(
        //     response => {
        //         let resData = response.payload.data.data.rows;
        //         this.setState({
        //             dataUser: resData
        //         });
        //
        //     }).catch(
        //     error => {
        //         if (error.response.data.errors.length > 0) {
        //             CreateError = `${error.response.data.message + " " + error.response.data.errors[0].msg}`;
        //             this.setState({
        //                 isCreateError: true,
        //             });
        //         }else{
        //             CreateError = error.response.data.message;
        //             this.setState({
        //                 isCreateError: true,
        //             });
        //         }
        //     }
        // );
    }

    handleNearestPoliceStation(value) {
        this.props.getNearestPoliceStationData(value).then(
            response => {
                console.log('user data parsing---Tracker', response.payload.data.data);
                let resData = response.payload.data.data;
                this.setState({
                    dataPoliceStationData: resData,
                    show: true
                });

            }).catch(
            error => {
                if (error.response.data.errors.length > 0) {
                    CreateError = `${error.response.data.message + " " + error.response.data.errors[0].msg}`;
                    this.setState({
                        isCreateError: true,
                    });
                }else{
                    CreateError = error.response.data.message;
                    this.setState({
                        isCreateError: true,
                    });
                }
            }
        );
    }

    handleSOSNumber(value) {
        console.log("handleSOSNumber ", value);
        this.setState({
            show: true,
            rowData: value
        });
    }

    hideInvoice() {
        this.setState({
            isShowInvoice: false
        })
    };

    renderPerPageRows() {
        let ordered_list = _.orderBy(this.state.dataUser, ['trackerId'], ['desc']);
        let list = ordered_list.slice((this.state.active - 1) * page_per_content, this.state.active * page_per_content);
        return _.map(list, row => {
            let trackerConfiguration = row.tracker.trackerConfiguration;
            let SosNumber = row.tracker.trackerSOSNumbers;
            return (
                <tr key={row.trackerId}>
                    <td>{row.trackerId}</td>
                    <td>{`${trackerConfiguration !== null ? trackerConfiguration.givenName : row.tracker.name}`}</td>
                    <td>
                        <span onClick={() => this.handleEmergencyNumber(row)} className="btn btn-info btn-sm mr-2"
                              title="Emergency Number"><i className="fas fa-headset"/></span>
                        <span onClick={() => this.handleNearestPoliceStation(row.trackerId)}
                              className="btn btn-info btn-sm mr-2" title="Police Station Number"><i
                            className="fas fa-hotel"/></span>
                        {SosNumber.length > 0 ?
                            <span onClick={() => this.handleSOSNumber(SosNumber)} className="btn btn-info btn-sm "
                                  title="Relative Number"><i className="fas fa-user-shield"/></span> :
                            <span className="btn btn-info btn-sm disabled" title="Relative Number"><i
                                className="fas fa-user-shield disabled"/></span>}
                    </td>
                </tr>
            );
        });
    }

    renderModalPerPageRows() {
        let ordered_list = _.orderBy(this.state.rowData, ['id'], ['desc']);
        //let list = ordered_list.slice((this.state.active - 1) * page_per_content, this.state.active * page_per_content);
        return _.map(ordered_list, row => {
            let phoneNumber = row.phoneNumber.phone;
            return (
                <div key={row.id}>
                    <div className="d-flex flex-row justify-content-center align-items-center">
                        <h4 className="mr-2"><i className="fas fa-phone mr-2"/> {phoneNumber}</h4>
                        <a className="badge badge-secondary"
                           href={`tel:${phoneNumber}`}>{/*<i className="fas fa-phone-square"></i>*/}Call</a>
                    </div>
                </div>
            );
        });
    }

    renderPoliceStationModalPerPageRows() {
        let ordered_list = this.state.dataPoliceStationData;
        console.log(ordered_list)

        return (
            <div>
                <div className="d-flex flex-row justify-content-center align-items-center">
                    <h4 className="mr-2">{ordered_list.name}</h4>
                </div>
                <div className="d-flex flex-row justify-content-center align-items-center">
                    <h4 className="mr-2"><i className="fas fa-phone mr-2"/> {ordered_list.phoneNumber}</h4>
                    <a className="badge badge-secondary"
                       href={`tel:${ordered_list.phoneNumber}`}>{/*<i className="fas fa-phone-square"></i>*/}Call</a>
                </div>
            </div>
        );
    }

    renderNationalSOSModalPerPageRows() {
        let ordered_list = this.state.dataNationalSOSData;
        //console.log(ordered_list)

        return (
            <div>
                <div className="d-flex flex-row justify-content-center align-items-center">
                    {/*<h4 className="mr-2">{ordered_list.configurable_parameter}</h4>*/}
                    <h4 className="mr-2">National Emergency</h4>
                </div>
                <div className="d-flex flex-row justify-content-center align-items-center">
                    <h4 className="mr-2"><i className="fas fa-phone mr-2"/> {ordered_list.value}</h4>
                    <a className="badge badge-secondary"
                       href={`tel:${ordered_list.value}`}>{/*<i className="fas fa-phone-square"></i>*/}Call</a>
                </div>
            </div>
        );

    }

    componentWillUnmount() {
        this.setState({
            rowData: '',
            dataPoliceStationData: '',
            dataNationalSOSData: ''
        })
    }

    render() {
        if (this.state.isRedirect) {
            return (<Redirect to={'/sos-number'}/>);
        }
        if (this.state.isCreateError === true) {
            return <ErrorMessage CreateError={CreateError} isCreateError={this.state.isCreateError}
                                 handleCreateError={this.handleCreateError}/>;
        }
        if (this.state.dataUser.length === 0) {
            return <ReactLoading className='relaod-logo-css' type="spinningBubbles" color="#aaaaaa" height={50}
                                 width={50}/>;
        }
        console.log("dataUser", this.state.dataUser);
        return (
            <Fragment>
                {this.state.isCreateError &&
                <ErrorMessageModal CreateError={CreateError} isCreateError={this.state.isCreateError}
                                   handleCreateError={this.handleCreateError}/>}
                <div>
                    <div>
                        <div className="d-flex justify-content-between mb-4 mt-5">
                            <span><strong>Tracker SOS Service</strong></span>
                        </div>
                        <hr/>
                    </div>
                    <div className="mt-4">
                        <div className="mt-4">
                            <Table hover borderless>
                                <thead className="thead-light">
                                <tr>
                                    <th>#</th>
                                    <th>Tracker</th>
                                    <th>SOS Options</th>
                                </tr>
                                </thead>
                                <tbody>
                                {this.state.dataUser.length > 0 && this.renderPerPageRows()}
                                </tbody>
                            </Table>
                        </div>
                        <div className="d-flex flex-wrap">
                        {this.state.dataUser.length > 0 && this.paginationBasic()}
                        </div>
                    </div>
                </div>

                <Modal className="mt-5" size="sm" show={this.state.show} onHide={this.handleClose}>
                    {/*<Modal.Header className="d-flex justify-content-center">*/}
                    {/*<Modal.Title>Package Price Details</Modal.Title>*/}
                    {/*</Modal.Header>*/}
                    <Modal.Body>
                        {/*<h5 className="card-title">SOS Relative Phone Number</h5>*/}
                        {this.state.rowData !== '' && this.renderModalPerPageRows()}
                        {this.state.dataPoliceStationData !== '' && this.renderPoliceStationModalPerPageRows()}
                        {this.state.dataNationalSOSData !== '' && this.renderNationalSOSModalPerPageRows()}
                    </Modal.Body>
                </Modal>
            </Fragment>
        );
    }
}

function mapStateToProps(state) {
    console.log("active Subscription");
    return {
        allUsersDetailsData: null,
    };
}

export default connect(mapStateToProps, {
    getUserTrackers,
    getAppConfigurationData,
    getNearestPoliceStationData,
    getFAQs
})(TrackerSOSList);

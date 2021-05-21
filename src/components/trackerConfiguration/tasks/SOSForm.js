import React, {Component, Fragment} from 'react';
import {Field, reduxForm} from 'redux-form';
import {
    deletePhoneNumber,
    getSOSNumber,
    setPhoneNumber,
    setSOSNumber,
    updatePhoneNumber,
    updateSOSNumber
} from '../../../actions/tracker';
import {renderField} from '../../reduxFormHelper/renderField';
import {connect} from "react-redux";
import {LOCAL_STORAGE_DATA_KEYNAME} from "../../../actions/types";
import {Redirect} from "react-router";
import Modal from "react-bootstrap/Modal";
import SuccessMessage from "../../common/errors/SuccessMessage";
import ErrorMessageModal from "../../common/errors/ErrorMessageModal";

const required = value => (value ? undefined : 'Required');
const number = value => value && isNaN(Number(value)) ? 'Must be a number' : undefined;


const initialState = {
    show: true,
    active: 1,
    setDeleteRowData: [],
    faqData: [],
    activePage: 1,
    setEditRowData: [],
    isSetEditRowData: false,
    isViewUpdateOption: false,
    isSetDeleteRowData: false,
    isCreateError: false,
    isSuccessCreate: false,
    sosNumberId: '',
    phoneNumberId: '',
    sosNumber: '',
    coordinates: '',
};

let CreateError = '';
let CreateSuccess = '';

let page_per_content = 10;

class SOSForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            ...initialState
        };
        this.handleSOSSubmit = this.handleSOSSubmit.bind(this);
        this.onClickDeleteHandler = this.onClickDeleteHandler.bind(this);
        this.onClickSetDeleteHandler = this.onClickSetDeleteHandler.bind(this);
        this.onChangePage = this.onChangePage.bind(this);
        this.handleBackButton = this.handleBackButton.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.renderPerPageRows = this.renderPerPageRows.bind(this);
        this.onChangeHandler = this.onChangeHandler.bind(this);
        this.onClickEditHandler = this.onClickEditHandler.bind(this);
        this.handleSuccessMessage = this.handleSuccessMessage.bind(this);
        this.handleCreateError = this.handleCreateError.bind(this);
    }

    componentDidMount() {
        //const userLocalData = JSON.parse(localStorage.getItem(LOCAL_STORAGE_DATA_KEYNAME));
        let resData = this.props.tracker.trackerSOSNumbers;
        if (this.props.tracker.trackerSOSNumbers.length > 0) {
            this.setState({
                faqData: resData,
            });
        }
    }


    handleSOSSubmit() {
        //console.log('onChangeHandler---sos', this.state);

        const userLocalData = JSON.parse(localStorage.getItem(LOCAL_STORAGE_DATA_KEYNAME));
        if (userLocalData != null) {
            const number_id = this.state.phoneNumberId;
            const sosNumberId = this.state.sosNumberId;
            const tracker_id = this.props.tracker.id;
            const user_id = userLocalData.user.id;


            let requestedData = {
                "phone": `${this.state.sosNumber}`
            };

            if (this.state.sosNumberId === '' && this.state.phoneNumberId === '') {
                console.log("say create....")

                this.props.setPhoneNumber(requestedData, user_id).then(response => {


                    let requestPhoneNumberData = {
                        "phoneNumberId": `${response.payload.data.data.id}`,
                        "coordinates": `${this.state.coordinates}`,
                        "isActive": "1",
                    };

                    this.props.setSOSNumber(requestPhoneNumberData, tracker_id).then(response => {
                        CreateSuccess = response.payload.data.message;
                        this.setState({
                            ...initialState,
                            isSuccessCreate: true
                        })
                    }).catch(error => {
                        if (error.response.data.errors.length > 0) {
                            CreateError = `${error.response.data.message + " " + error.response.data.errors[0].msg}`;
                            this.setState({
                                isCreateError: true,
                            });
                        } else {
                            CreateError = error.response.data.message;
                        }
                    });

                }).catch(error => {
                    if (error.response.data.errors.length > 0) {
                        CreateError = `${error.response.data.message + " " + error.response.data.errors[0].msg}`;
                        this.setState({
                            isCreateError: true,
                        });
                    } else {
                        CreateError = error.response.data.message;
                    }
                })
            } else {
                console.log("say update....")
                this.props.updatePhoneNumber(requestedData, user_id, number_id).then(response => {


                    let requestPhoneNumberData = {
                        "phoneNumberId": `${response.payload.data.data.id}`,
                        "coordinates": `${this.state.coordinates}`,
                        "isActive": "1",
                    };

                    this.props.updateSOSNumber(requestPhoneNumberData, tracker_id, sosNumberId).then(response => {
                        CreateSuccess = response.payload.data.message;
                        this.setState({
                            ...initialState,
                            isSuccessCreate: true
                        })
                    }).catch(error => {
                        if (error.response.data.errors.length > 0) {
                            CreateError = `${error.response.data.message + " " + error.response.data.errors[0].msg}`;
                            this.setState({
                                isCreateError: true,
                            });
                        } else {
                            CreateError = error.response.data.message;
                        }
                    });

                }).catch(error => {
                    if (error.response.data.errors.length > 0) {
                        CreateError = `${error.response.data.message + " " + error.response.data.errors[0].msg}`;
                        this.setState({
                            isCreateError: true,
                        });
                    } else {
                        CreateError = error.response.data.message;
                    }
                })
            }
        }
    }

    onChangeHandler(event) {
        this.setState({
            [event.target.name]: event.target.value
        })
    }

    handleBackButton() {
        this.setState({
            isSetEditRowData: false,
            setEditRowData: [],
            sosNumberId: '',
            phoneNumberId: '',
            sosNumber: '',
            coordinates: '',
        });

        this.props.initialize({
            sosNumber: '',
            coordinates: '',
        });
    }

    handleClose() {
        this.setState({
            isSetDeleteRowData: false,
            setDeleteRowData: [],
            isSuccessCreate: false,
        });
    }

    onClickSetDeleteHandler(value) {
        this.setState({
            setDeleteRowData: value,
            isSetDeleteRowData: true
        });
    }

    onClickEditHandler(value) {
        //console.log(value)
        this.setState({
            setEditRowData: value,
            isSetEditRowData: true,
            sosNumberId: value.id,
            phoneNumberId: value.phoneNumber.id,
            sosNumber: value.phoneNumber.phone,
            coordinates: value.coordinates,
        });

        this.props.initialize({
            sosNumber: value.phoneNumber.phone,
            coordinates: value.coordinates,
        });
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
            isRedirect: true,
        })
    }

    onClickDeleteHandler(value) {
        //console.log(this.state.setDeleteRowData, value)

        if (value === 1) {
            const userLocalData = JSON.parse(localStorage.getItem(LOCAL_STORAGE_DATA_KEYNAME));
            if (userLocalData != null) {
                const user_id = userLocalData.user.id;

                if (this.state.setDeleteRowData.phoneNumberId !== '') {
                    console.log("say delete phone....")

                    this.props.deletePhoneNumber(user_id, this.state.setDeleteRowData.phoneNumberId).then(response => {

                        CreateSuccess = response.payload.data.message;
                        this.setState({
                            ...initialState,
                            isSuccessCreate: true
                        })

                    }).catch(error => {
                        if (error.response.data.errors.length > 0) {
                            CreateError = `${error.response.data.message + " " + error.response.data.errors[0].msg}`;
                            this.setState({
                                isCreateError: true,
                            });
                        } else {
                            CreateError = error.response.data.message;
                        }
                    })
                }
            }
        }
        if (value === 2) {
            return this.handleClose();
        }
    }

    onChangePage(value) {
        this.setState({
            active: value
        })
    }

    renderPerPageRows() {
        let ordered_list = _.orderBy(this.state.faqData, ['id'], ['desc']);
        let list = ordered_list.slice((this.state.active - 1) * page_per_content, this.state.active * page_per_content);
        return _.map(list, row => {
            return (
                <tr key={row.id}>
                    {/*<td>{row.id}</td>*/}
                    <td>{row.phoneNumber.phone}</td>
                    <td>{row.coordinates}</td>
                    <td>
                        <span onClick={() => this.onClickEditHandler(row)}
                              className="btn btn-warning btn-sm mr-2">Edit</span>
                        <span onClick={() => this.onClickSetDeleteHandler(row)}
                              className="btn btn-danger btn-sm">Delete</span>
                    </td>
                </tr>
            );
        });
    }


    render() {
        if (this.state.isRedirect) {
            return (<Redirect to={'/configure-tracker'}/>);
        }
        const {handleSubmit, pristine, reset, submitting} = this.props;
        return (
            <Fragment>

                {
                    this.state.isSuccessCreate &&
                    <SuccessMessage
                        CreateSuccess={CreateSuccess}
                        isCreateSuccess={this.state.isSuccessCreate}
                        handleSuccessMessage={this.handleSuccessMessage}
                    />
                }

                {
                    this.state.isCreateError &&
                    <ErrorMessageModal
                        CreateError={CreateError}
                        isCreateError={this.state.isCreateError}
                        handleCreateError={this.handleCreateError}
                    />
                }

                {
                    this.state.isSetDeleteRowData &&
                    <Modal className="mt-5" show={this.state.show} onHide={this.handleClose}>
                        <Modal.Body className="p-5">
                            <div className="d-flex flex-column align-items-center">
                                <label>Are You Delete Type?</label>
                                <i className="far fa-times-circle fa-2x" style={{color: 'red'}}/>
                                <div className="d-flex flex-row align-content-between pt-2">
                                    <span onClick={() => this.onClickDeleteHandler(1)}
                                          className="btn btn-danger btn-sm col-md-6 mr-1">Delete</span>
                                    <span onClick={() => this.onClickDeleteHandler(2)}
                                          className="btn btn-primary btn-sm col-md-6 ml-1">Cancel</span>
                                </div>
                            </div>
                        </Modal.Body>
                    </Modal>
                }

                {
                    this.state.faqData.length < 3 &&
                    <div className="d-flex justify-content-between pt-2 pb-2">
                        <span onClick={() => this.setState({isSetEditRowData: true})}
                          className="col-md-3 btn btn-outline-primary">Create SOS</span>
                    </div>
                }

                {
                    this.state.faqData.length > 0 && this.state.isSetEditRowData !== true &&
                    <div>
                        <table className="table">
                            <thead className="thead-light">
                            <tr>
                                {/*<th scope="col"># Id</th>*/}
                                <th scope="col">Number</th>
                                <th scope="col">Location</th>
                                <th scope="col-md-1">Action</th>
                            </tr>
                            </thead>
                            <tbody>
                                {this.renderPerPageRows()}
                            </tbody>
                        </table>

                        <div className="d-flex justify-content-between">
                            <span onClick={this.props.veiwTracker} className="col-md-2 btn btn-primary">Back</span>
                        </div>
                    </div>
                }

                {
                    this.state.isSetEditRowData === true &&
                    <form className="form-group pt-2">
                        <div className="form-group row">
                            <label htmlFor="trackerName" className="col-md-4 col-form-label">SOS Number</label>
                            <div className="col-md-6">
                                <Field
                                    name="sosNumber"
                                    className="form-control"
                                    component={renderField}
                                    validate={[number]}
                                    type="number"
                                    placeholder="Enter SOS Number"
                                    onChange={this.onChangeHandler}
                                />
                            </div>
                        </div>
                        <div className="form-group row">
                            <label htmlFor="trackerName" className="col-md-4 col-form-label">Co-Ordinates</label>
                            <div className="col-md-6">
                                <Field
                                    name="coordinates"
                                    className="form-control"
                                    component={renderField}
                                    validate={required}
                                    type="text"
                                    placeholder="Enter coordinate"
                                    onChange={this.onChangeHandler}
                                />
                            </div>
                        </div>
                        <div className="d-flex justify-content-between align-items-center">
                            <span onClick={() => this.handleBackButton()} className="col-md-3 btn btn-outline-primary">Back To List</span>
                            <span onClick={() => this.handleSOSSubmit()} className="col-md-2 btn btn-success">Save</span>
                        </div>
                    </form>
                }
            </Fragment>
        );
    }
}

function validate(values) {
    const errors = {};
    if (!values.sosNumber) {
        errors.sosNumber = 'Enter SOS Number';
    }
    return errors;
}

SOSForm = reduxForm({
    // a unique name for the form
    form: 'SOSForm',
    enableReinitialize: false,
    Field,
})(SOSForm);


export default connect(null, {
    setPhoneNumber,
    setSOSNumber,
    getSOSNumber,
    updatePhoneNumber,
    updateSOSNumber,
    deletePhoneNumber
})(SOSForm);


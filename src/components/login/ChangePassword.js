import React, {Component} from 'react';
import {reduxForm} from 'redux-form';
import {connect} from 'react-redux';
import {resetPassword} from '../../actions/auth_actions';
import ErrorMessage from "../common/errors/ErrorMessage";
import Redirect from "react-router/es/Redirect";
import Modal from "react-bootstrap/Modal";
import NavBar from "../common/NavBar";
import SidebarView from "../common/SidebarView";
import {LOCAL_STORAGE_DATA_KEYNAME} from "../../actions/types";


const initialState = {
    isRedirect: false,
    loadingAnimation: false,
    access_type: 0,
    password1: '',
    password2: '',
    phone: '',
    token: '',
    show: true,
    isCreateError: false,
    isSuccessCreate: false,

};

let CreateError = '';
let CreateSuccess = '';

class ChangePassword extends Component {
    constructor(props) {
        super(props);
        this.state = {
            ...initialState
        };
        this.changeHandler = this.changeHandler.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.handleCreateError = this.handleCreateError.bind(this);
    }

    componentDidMount() {
        const userLocalData = JSON.parse(localStorage.getItem(LOCAL_STORAGE_DATA_KEYNAME));
        if (userLocalData != null) {
            this.setState({
                phone: userLocalData.user.mobileNo,
                token: userLocalData.token
            })
        } else {
            CreateError = "User Phone number not set!!";
            this.setState({
                isCreateError: true,
            });
        }

    }

    handleClose() {
        this.setState({
            show: true,
            isSuccessCreate: false,
            isRedirect: true,
            password1: '',
            password2: '',
        });
    }

    handleCreateError() {
        this.setState({
            isCreateError: !this.state.isCreateError,
        })
    }

    changeHandler(event) {
        this.setState({
            [event.target.name]: event.target.value
        })
    }


    onSubmit(e) {
        e.preventDefault();
        if (this.state.password1 === this.state.password2) {
            const userData = {
                mobileNo: this.state.phone,
                password: this.state.password1
            }
            const headers = {
                "x-access-token": this.state.token
            }

            this.props.resetPassword(userData, headers).then(
                response => {
                    CreateSuccess = response.payload.data.message;
                    this.setState({
                        isSuccessCreate: true,
                        //isRedirect: true
                    })
                }).catch(error => {
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
            });
        } else {
            CreateError = "Password Not Match!";
            this.setState({
                isCreateError: true,
            });
        }


    }

    render() {
        if (this.state.isRedirect) {
            return <Redirect to={{pathname: '/change-password'}}/>;
        }
        return (
            <div id="wrapper" className="toggled">
                <SidebarView />
                <div id="page-content-wrapper " className="">
                    <NavBar/>
                    <div className="container-fluid">
                        <h1>Product Page</h1>
                        <div className="row">
                            <div className="col-sm-6 offset-3 mt-5">
                                <div className="card">
                                    <div className="card-body">
                                        {
                                            this.state.isSuccessCreate &&
                                            <Modal className="mt-5" show={this.state.show} onHide={this.handleClose}>
                                                <Modal.Body className="p-5">
                                                    {/*<h1>{userCreateSuccess}</h1>*/}
                                                    <div className="d-flex flex-column align-items-center">
                                                        <label>{CreateSuccess}</label>
                                                        <div className="d-flex flex-row align-items-center">
                                                            <i className="far fa-check-circle fa-5x"/>
                                                        </div>
                                                    </div>
                                                    <div className="d-flex flex-column align-items-end">
                                                        <span className="col-md-2 btn btn-sm btn-info"
                                                              onClick={this.handleClose}>Ok</span>
                                                    </div>
                                                </Modal.Body>
                                            </Modal>
                                        }

                                        {
                                            this.state.isCreateError &&
                                            <ErrorMessage
                                                CreateError={CreateError}
                                                isCreateError={this.state.isCreateError}
                                                handleCreateError={this.handleCreateError}
                                            />
                                        }

                                        <form onSubmit={this.onSubmit.bind(this)}>
                                            <div className="form-group col-12">
                                                <label htmlFor="password1">New Password</label>
                                                <input
                                                    type="password"
                                                    name="password1"
                                                    id="password1"
                                                    placeholder="Enter New Password"
                                                    className="form-control col-12"
                                                    value={this.state.password1}
                                                    onChange={this.changeHandler}
                                                    required
                                                />
                                            </div>
                                            <div className="form-group col-12">
                                                <label htmlFor="password1">Re-Type New Password</label>
                                                <input
                                                    type="password"
                                                    name="password2"
                                                    id="password2"
                                                    placeholder="Re-Type New Password"
                                                    className="form-control col-12"
                                                    value={this.state.password2}
                                                    onChange={this.changeHandler}
                                                />
                                            </div>
                                            <div className="d-flex justify-content-center align-items-center mt-4">
                                                <button
                                                    type="submit"
                                                    className="btn text-white px-5 py-1" style={{background: '#43425D'}}
                                                >
                                                    Change Password
                                                </button>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default reduxForm({
    form: 'ResetForm',
})(connect(null, {resetPassword})(ChangePassword));


import React, {Component} from 'react';
import {reduxForm} from 'redux-form';
import {connect} from 'react-redux';
import {resetPassword} from '../../actions/auth_actions';
import {loadingAnimation} from '../common/constantValues';
import ErrorMessage from "../common/errors/ErrorMessage";
import Redirect from "react-router/es/Redirect";
import Modal from "react-bootstrap/Modal";


const initialState = {
    isRedirect: false,
    loadingAnimation: false,
    access_type: 0,
    password: '',
    phone: '',
    token: '',
    show: true,
    isCreateError: false,
    isSuccessCreate: false,

};

let CreateError = '';
let CreateSuccess = '';

class ResetPassword extends Component {
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
        if (this.props.location.state !== undefined) {
            this.setState({
                token: this.props.location.state[0].token,
                phone: this.props.location.state[1],
            })
        } else {
            this.setState({
                isRedirect: true
            })
        }

    }

    handleClose() {
        this.setState({
            show: true,
            isSuccessCreate: false,
            isRedirect: true
        });
    }

    handleCreateError() {
        this.setState({
            isCreateError: !this.state.isCreateError,
        })
    }

    changeHandler(e) {
        //e.preventDefault();
        //console.log("---value----", e.target.value)
        this.setState({
            [e.target.name]: e.target.value
        })
    }


    onSubmit(e) {
        e.preventDefault();
        //console.log('onSumit ----------->>>:', this.state);
        const userData = {
            mobileNo: this.state.phone,
            password: this.state.password
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
                // CreateError = error.response.data.errors[0].msg;
                CreateError = `${error.response.data.message + " " + error.response.data.errors[0].msg}`;
                this.setState({
                    isCreateError: true,
                });
            }
        });
    }

    render() {
        // const { type, name, placeholder } = this.state
        //console.log("-----this.state.inputValue------", this.props);
        if (this.state.isRedirect) {
            return <Redirect to={{pathname: '/login'}}/>;
        }
        return (
            <div className="row">
                <div className="loginpageleft col-6 mx-0 p-0">

                    <div>
                        <img width="100%" src="../../../images/loginpage/back.jpg" alt="wave"/>
                    </div>
                </div>
                <div className="col-6 p-5 border">

                    <div className=" d-flex justify-content-center align-items-center">
                        <div>
                            <div className="d-flex justify-content-center align-items-center">
                                <span><h4>Zoya Tracking System</h4></span>
                                {/*<img src="../../../images/loginpage/logo.png" alt="People Tracking System" width="50%" />*/}
                            </div>
                            {
                                (this.state.loadingAnimation) &&
                                loadingAnimation('Loading')
                            }
                            <div className="d-flex justify-content-center align-items-center">
                                <p
                                    className="text-secondary"
                                    style={{fontWeight: 300, fontSize: '1vw'}}
                                >
                                    Welcome! Please Reset Password.
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="col-6 mx-auto">
                        {this.state.isSuccessCreate && <label>{CreateSuccess}</label>}
                        {this.state.isSuccessCreate &&
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
                                    <span className="col-md-2 btn btn-sm btn-info" onClick={this.handleClose}>Ok</span>
                                </div>
                            </Modal.Body>
                        </Modal>}
                        <ErrorMessage CreateError={CreateError} isCreateError={this.state.isCreateError}
                                      handleCreateError={this.handleCreateError}/>
                        <form onSubmit={this.onSubmit.bind(this)}>
                            <div className="form-group col-12">
                                <label htmlFor="email">New Password</label>
                                <input
                                    type="password"
                                    name="password"
                                    placeholder="Enter New Password"
                                    className="ResetForm col-12"
                                    value={this.state.password}
                                    onChange={this.changeHandler}
                                    required
                                />
                            </div>
                            <div className="d-flex justify-content-center align-items-center mt-4">
                                <button
                                    type="submit"
                                    className="btn text-white px-5 py-1" style={{background: '#43425D'}}
                                >
                                    Reset Password
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        );
    }
}


function mapStateToProps(state) {
    return state;
}

export default reduxForm({
    form: 'ResetForm',
})(connect(mapStateToProps, {resetPassword})(ResetPassword));


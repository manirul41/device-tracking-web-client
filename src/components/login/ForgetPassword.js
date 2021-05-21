import React, {Component} from 'react';
import {reduxForm} from 'redux-form';
import {connect} from 'react-redux';
import {forgetPassword} from '../../actions/auth_actions';
import {loadingAnimation} from '../common/constantValues';
import ErrorMessage from "../common/errors/ErrorMessage";
import ValidatePin from "./ValidatePin";
import Redirect from "react-router/es/Redirect";


const initialState = {
    loginerroroccured: false,
    redirect: false,
    loadingAnimation: false,
    access_type: 0,
    option_one: 1,
    option_two: 2,
    phone: '',
    show: true,
    isCreateError: false,
    isSuccessCreate: false,

};

let CreateError = '';
let CreateSuccess = '';

class ForgetPassword extends Component {
    constructor(props) {
        super(props);
        this.state = {
            ...initialState
        };
        this.changeHandler = this.changeHandler.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.handleCancel = this.handleCancel.bind(this);
        this.handleCreateError = this.handleCreateError.bind(this);
    }

    handleClose() {
        this.setState({
            show: true,
            isSuccessCreate: false,
            isRedirect: true
        });
    }

    handleCancel() {
        //console.log("-----cancel------")
        this.setState({
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
            mobileNo: this.state.phone
        }
        this.props.forgetPassword(userData).then(
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
        //console.log("-----this.state.inputValue------", this.state);
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
                                    In order to verify your identity, we'll send you a code to your preferred phone
                                    number below.
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="col-6 mx-auto">
                        {this.state.isSuccessCreate && <label>{CreateSuccess}</label>}
                        <ErrorMessage CreateError={CreateError} isCreateError={this.state.isCreateError}
                                      handleCreateError={this.handleCreateError}/>
                        {this.state.isSuccessCreate === false &&
                        <form onSubmit={this.onSubmit.bind(this)}>
                            <label htmlFor="email"/>
                            <div className="form-group col-12">
                                <label htmlFor="email"/>
                                <input
                                    type="number"
                                    name="phone"
                                    placeholder="Enter Phone Number"
                                    className="ResetForm col-12"
                                    value={this.state.phone}
                                    onChange={this.changeHandler}
                                    required
                                />
                            </div>
                            <div className="d-flex justify-content-center align-items-center mt-4">
                                <button
                                    type="submit"
                                    className="btn text-white px-4 py-1" style={{background: '#43425D'}}
                                >
                                    Send Verification Code
                                </button>
                                <button
                                    className="btn text-white px-4 py-1 ml-2"
                                    style={{background: '#ff2b3e'}}
                                    onClick={this.handleCancel}>Cancel
                                </button>
                            </div>
                        </form>}

                        {this.state.isSuccessCreate && <ValidatePin phoneNumber={this.state.phone}/>}

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
})(connect(mapStateToProps, {forgetPassword})(ForgetPassword));


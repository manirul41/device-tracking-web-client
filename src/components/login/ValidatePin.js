import React, {Component, Fragment} from 'react';
import {connect} from 'react-redux';
import {validatePin} from '../../actions/auth_actions';
import Modal from "react-bootstrap/Modal";
import ErrorMessage from "../common/errors/ErrorMessage";
import Redirect from "react-router/es/Redirect";


const initialState = {
    loginerroroccured: false,
    isRedirect: false,
    loadingAnimation: false,
    access_type: 0,
    token: '',
    phone: '',
    pin: '',
    show: true,
    isCreateError: false,
    isSuccessCreate: false,

};

let CreateError = '';
let CreateSuccess = '';

class ValidatePin extends Component {
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

    componentDidMount() {
        this.setState({
            phone: this.props.phoneNumber
        })
    }

    handleCancel() {
        //console.log("-----cancel------")
        this.setState({
            isRedirect: true
        });
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
            code: this.state.pin
        }
        this.props.validatePin(userData).then(
            response => {
                CreateSuccess = response.payload.data.message;
                this.setState({
                    isSuccessCreate: true,
                    token: response.payload.data.token
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
            return <Redirect to={{pathname: '/reset-password', state: [this.state.token, this.state.phone]}}/>;
        }

        return (
            <Fragment>
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
                        <label htmlFor="pin">Enter Verification Code</label>
                        <input
                            type="text"
                            name="pin"
                            placeholder="Verification Code"
                            className="ResetForm col-12"
                            value={this.state.pin}
                            onChange={this.changeHandler}
                            required
                        />
                    </div>
                    <div className="d-flex justify-content-center align-items-center mt-4">
                        <button
                            type="submit"
                            className="btn text-white px-5 py-1" style={{background: '#43425D'}}
                        >
                            Submit Verification Code
                        </button>

                        <button
                            className="btn text-white px-4 py-1 ml-2"
                            style={{background: '#ff2b3e'}}
                            onClick={this.handleCancel}>Cancel
                        </button>
                    </div>
                </form>
            </Fragment>
        );
    }
}


function mapStateToProps(state) {
    return state;
}

export default connect(mapStateToProps, {validatePin})(ValidatePin);


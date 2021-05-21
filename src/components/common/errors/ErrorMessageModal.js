import React, {Component, Fragment} from 'react';
import Modal from "react-bootstrap/Modal";

const initialState = {
    isShow: false
};

class ErrorMessage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            ...initialState
        };
    }

    componentDidMount() {
        this.setState({
            isShow: true
        })
    }


    render() {
        return (
            <Fragment>
                <Modal className="mt-5" show={this.state.isShow} onHide={this.props.handleCreateError}>
                    <Modal.Body className="p-5">
                        <div className="d-flex flex-column align-items-center">
                            <label>{this.props.CreateError}</label>
                            <div className="d-flex flex-row align-items-center">
                                <i className="fas fa-exclamation-triangle fa-3x" style={{color: 'red'}}/>
                            </div>
                        </div>
                    </Modal.Body>
                </Modal>
            </Fragment>
        );
    }
}

export default ErrorMessage;

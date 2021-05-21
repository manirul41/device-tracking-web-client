import React, {Component, Fragment} from 'react';
import Modal from "react-bootstrap/Modal";

const initialState = {
    isShow: false
};

 class SuccessMessage extends Component {
     constructor(props) {
         super(props);
         this.state = {
             ...initialState
         };
         this.setShow = this.setShow.bind(this);
     }

     componentDidMount() {
         this.setState({
             isShow: true
         })
     }


     setShow() {
         this.props.handleCreateError()
     }

     render() {
         return (
             <Fragment>
                 <Modal className="mt-5" show={this.state.isShow} onHide={this.props.handleSuccessMessage}>
                     <Modal.Body className="p-5">
                         {/*<h1>{userCreateSuccess}</h1>*/}
                         <div className="d-flex flex-column align-items-center">
                             <label>{this.props.CreateSuccess}</label>
                             <div className="d-flex flex-row align-items-center">
                                 <i className="far fa-check-circle fa-5x"/>
                             </div>
                         </div>
                     </Modal.Body>
                 </Modal>
             </Fragment>
         );
     }
 }

export default SuccessMessage;

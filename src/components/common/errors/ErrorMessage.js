import React, {Component, Fragment} from 'react';
import Alert from "react-bootstrap/Alert";

const initialState = {

};

 class ErrorMessage extends Component {
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
                 <Alert variant="danger" show={this.props.isCreateError} onClose={() => this.setShow()} dismissible>
                     <label>{this.props.CreateError}</label>
                 </Alert>
             </Fragment>
         );
     }
 }

export default ErrorMessage;

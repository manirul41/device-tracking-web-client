import React, {Component, Fragment} from 'react';
import {connect} from 'react-redux';
import ReactLoading from 'react-loading';
import {Field} from "redux-form";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import {LOCAL_STORAGE_DATA_KEYNAME} from "../../../actions/types";
import moment from "moment";

const initialState = {
    userLocalData: null,
    isShow: true
};

class ViewInvoice extends Component {
    constructor(props) {
        super(props);
        this.state = {
            ...initialState
        };
    }

    componentDidMount() {

        const userLocalData = JSON.parse(localStorage.getItem(LOCAL_STORAGE_DATA_KEYNAME));
        if (userLocalData != null) {
            this.setState({
                isShow: true,
                userLocalData: userLocalData.user
            })
        }
    }

    render() {
        console.log("userLocalData", this.state.userLocalData)
        if (this.props.invoiceRowData.length === 0 || this.state.userLocalData === null) {
            return <ReactLoading className='relaod-logo-css' type="spinningBubbles" color="#aaaaaa" height={50}
                                 width={50}/>;
        }
        return (
            <Fragment>
                <Modal className="mt-5" size="lg" show={this.state.isShow} onHide={this.props.handleClose}>
                    {/*<Modal.Header closeButton>*/}
                    {/*<Modal.Title>Purchase Invoice</Modal.Title>*/}
                    {/*</Modal.Header>*/}
                    <Modal.Body>
                        <div className="d-flex justify-content-center pt-3 pb-5">
                            <h4>Purchase Invoice</h4>
                        </div>
                        <div className="d-flex justify-content-between">
                            <img src="./../../../../images/loginpage/logo.png" alt="Zoya" height="50" />
                            <span><strong>Invoice Id:</strong> {this.props.invoiceRowData.invoiceNumber}</span>
                        </div>
                        <hr/>
                        <div className="d-flex justify-content-between">
                            <div className="d-flex flex-column">
                                <div className="p-2">
                                    <h5 className="mb-0">Service Requested By:</h5>
                                    <p className="mb-0">Name: {this.state.userLocalData.name !== null ? this.state.userLocalData.name : "N/A"}</p>
                                    <p className="mb-0">Email: {this.state.userLocalData.email !== null ? this.state.userLocalData.email : "N/A"}</p>
                                </div>
                                <div className="p-2">
                                    <h5 className="mb-0">Service Provided By:</h5>
                                    <p className="mb-0">Zoya.com.bd</p>
                                    <p className="mb-0">Email: zoya@gmail.com</p>
                                    <p className="mb-0">Address: Dhaka,Bangladesh</p>
                                </div>
                                <div className="p-2">
                                    <h5 className="mb-0">Payment Method:</h5>
                                    <p className="mb-0">{this.props.invoiceRowData.paymentType !== null ? `${this.props.invoiceRowData.paymentType}`+" "+`${this.props.invoiceRowData.paymentStatus === true ? "(Success)" : "(Pending)"}` : "Unknown" }</p>
                                </div>
                            </div>
                            <div className="d-flex flex-column" align="right">
                                <div className="p-2">
                                    <h5 className="mb-0">Order Date:</h5>
                                    <p className="mb-0">{moment(this.props.invoiceRowData.invoiceDate).format("MMM DD, YYYY")}</p>
                                </div>
                            </div>
                        </div>
                        <div className="d-flex">
                            <div className="card col-md-12 p-0">
                                <div className="card-header">
                                    Order summary
                                </div>
                                <div className="card-body">
                                    <div className="table-responsive">
                                        <table className="table table-condensed">
                                            <thead>
                                            <tr>
                                                <td><strong>Item(s)</strong></td>
                                                <td className="text-center"><strong/></td>
                                                <td className="text-center"><strong/></td>
                                                <td className="text-right"><strong>Price</strong></td>
                                            </tr>
                                            </thead>
                                            <tbody>
                                            <tr>
                                                <td>Price</td>
                                                <td className="text-center"/>
                                                <td className="text-center">:</td>
                                                <td className="text-right">BDT. {this.props.invoiceRowData.total}</td>
                                            </tr>
                                            <tr>
                                                <td>Discount</td>
                                                <td className="text-center"/>
                                                <td className="text-center">:</td>
                                                <td className="text-right">BDT. {this.props.invoiceRowData.discount}</td>
                                            </tr>
                                            <tr>
                                                <td>Subtotal</td>
                                                <td className="text-center"/>
                                                <td className="text-center">:</td>
                                                <td className="text-right">BDT. {this.props.invoiceRowData.subTotal}</td>
                                            </tr>
                                            <tr>
                                                <td>Vat</td>
                                                <td className="text-center"/>
                                                <td className="text-center">:</td>
                                                <td className="text-right">BDT. {this.props.invoiceRowData.vat}</td>
                                            </tr>
                                            <tr>
                                                <td className="thick-line"/>
                                                <td className="thick-line text-center"><strong>Total Amount</strong>
                                                </td>
                                                <td className="text-center">:</td>
                                                <td className="thick-line text-right">BDT. {this.props.invoiceRowData.total}</td>
                                            </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-md-12 text-center pt-5">
                                <h4>Thank you for being with Creative Lawyer</h4>
                            </div>
                        </div>
                        <hr/>
                        <div className="d-flex justify-content-between">
                            <div className="d-flex flex-column">
                                <div className="p-2">
                                    <p className="mb-0"><strong>Zoya.com.bd</strong></p>
                                    <p className="mb-0"><strong>Address:</strong> 554 Rd No. 9, Dhaka, Bangladesh.</p>
                                    <p className="mb-0"><strong>Phone:</strong> +8809666911559</p>
                                </div>
                            </div>
                            <div className="d-flex flex-column" align="right">
                                <div className="p-2">
                                    <p className="mb-0"><strong>Email:</strong> info@zoya.com.bd</p>
                                    <p className="mb-0"><strong>Website:</strong> http://zoya.com.bd</p>
                                </div>
                            </div>
                        </div>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={this.props.handleClose}>
                            Close
                        </Button>
                        {/*<Button variant="primary" onClick={this.handlePaymentModel}>*/}
                            {/*Next*/}
                        {/*</Button>*/}
                    </Modal.Footer>
                </Modal>
                {/*<Modal className="mt-5" size="lg" show={this.state.showPayment} onHide={this.handlePaymentClose}>*/}
                    {/*<Modal.Header className="d-flex justify-content-center">*/}
                        {/*<Modal.Title>Select Payment Method To Pay:</Modal.Title>*/}
                    {/*</Modal.Header>*/}
                    {/*<Modal.Body>*/}
                        {/*/!*<div className="d-flex justify-content-center pt-3 pb-5">*!/*/}
                        {/*/!*<h4>Select Payment Method To Pay:</h4>*!/*/}
                        {/*/!*</div>*!/*/}


                        {/*<div className="d-flex flex-column">*/}
                            {/*<div className="p-2">*/}
                                {/*<form>*/}
                                    {/*<div>*/}
                                        {/*<div className="d-flex flex-column">*/}
                                            {/*<label>*/}
                                                {/*<Field*/}
                                                    {/*name="paymentMethod"*/}
                                                    {/*component="input"*/}
                                                    {/*type="radio"*/}
                                                    {/*value="online"*/}
                                                    {/*onChange={this.handleChangeFrom}*/}
                                                {/*/>*/}
                                                {/*Online Payment Geteway*/}
                                            {/*</label>*/}
                                            {/*<label>*/}
                                                {/*<Field*/}
                                                    {/*name="paymentMethod"*/}
                                                    {/*component="input"*/}
                                                    {/*type="radio"*/}
                                                    {/*value="cash"*/}
                                                    {/*onChange={this.handleChangeFrom}*/}
                                                {/*/>*/}
                                                {/*By Cash / Offline Confirmation*/}
                                            {/*</label>*/}
                                        {/*</div>*/}
                                    {/*</div>*/}
                                    {/*/!*<div className="d-flex justify-content-center align-items-center mt-4">*!/*/}
                                    {/*/!*<button*!/*/}
                                    {/*/!*type="submit"*!/*/}
                                    {/*/!*className="btn text-white px-5 py-1" style={{ background: '#43425D' }}*!/*/}
                                    {/*/!*>*!/*/}
                                    {/*/!*Payment*!/*/}
                                    {/*/!*</button>*!/*/}
                                    {/*/!*</div>*!/*/}
                                {/*</form>*/}
                            {/*</div>*/}
                        {/*</div>*/}
                    {/*</Modal.Body>*/}
                    {/*<Modal.Footer>*/}
                        {/*<Button variant="secondary" onClick={this.handlePaymentClose}>*/}
                            {/*Close*/}
                        {/*</Button>*/}
                        {/*<Button variant="primary" onClick={this.handlePaymentSubmit}>*/}
                            {/*Pay Now*/}
                        {/*</Button>*/}
                    {/*</Modal.Footer>*/}
                {/*</Modal>*/}
            </Fragment>
        );
    }
}

export default connect(null, null)(ViewInvoice);

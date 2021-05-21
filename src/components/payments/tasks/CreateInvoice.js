import React, {Component, Fragment} from 'react';
import {connect} from 'react-redux';
import ReactLoading from "react-loading";
import {Redirect} from "react-router";
import moment from 'moment'
import {LOCAL_STORAGE_DATA_KEYNAME} from "../../../actions/types";
import {setUserSubscription, setSubscriptionInvoice, setSubscriptionInvoiceSSL} from '../../../actions/product'
import OnlinePaymentMethod from "./OnlinePaymentMethod";


const initialState = {
    userId: null,
    userSubscriptionId: null,
    paymentMethodId: null,
    paymentType: null,
    invoiceNumber: null,
    invoiceDate: null,
    paymentDate: null,
    paymentStatus: 0,
    packagePriceId: null,
    vat: null,
    subTotal: null,
    discount: null,
    total: null,
    cycleStartsAt: null,
    cycleEndDate: null,
    isRedirect: false,
    isCycleStartsAt: false,
    isOnlinePaymentMethod: false,
    sslResponseData: null,

};

class CreateInvoice extends Component {
    constructor(props) {
        super(props);
        this.state = {
            ...initialState
        };
        this.onChangeHandler = this.onChangeHandler.bind(this);
        this.onChangeHandler = this.onChangeHandler.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentDidMount() {
        console.log(this.props);
    }

    onChangeHandler(event) {
        console.log(event.target.name, event.target.value);
        this.setState({
            [event.target.name]: event.target.value
        })

    }

    handleSubmit() {

        const confirmResponse = confirm("Are you sure?");
        console.log(confirmResponse);
        if (confirmResponse) {
            if (parseInt(this.state.paymentType) === 1){
                const userLocalData = JSON.parse(localStorage.getItem(LOCAL_STORAGE_DATA_KEYNAME));
                const userSubscriptionId  = this.props.packageData.userSubscriptionId;
                const invoiceData = {
                    userId : JSON.stringify(userLocalData.user.id),
                    //paymentMethodId : this.state.paymentMethodId,
                    //paymentType : this.state.paymentType,
                    //invoiceNumber : this.state.invoiceNumber,
                    //invoiceDate : this.state.invoiceDate,
                    //paymentDate : this.state.paymentDate,
                    //paymentStatus : 0,
                    packagePriceId : this.props.packageData.packagePriceId,
                    vat : JSON.stringify(this.props.packageData.vat),
                    subTotal : JSON.stringify(this.props.packageData.subTotal),
                    discount : JSON.stringify(this.props.packageData.discount),
                    total : JSON.stringify(this.props.packageData.total),
                    cycleStartsAt : this.props.packageData.cycleStartsAt,
                    cycleEndDate : this.props.packageData.cycleEndDate
                };
                console.log("submit", invoiceData, userSubscriptionId);
                const requestSubscriptionInvoice = this.props.setSubscriptionInvoice(invoiceData, userSubscriptionId);

                requestSubscriptionInvoice.then( response => {
                    console.log("Successfully Invoice Created!", response);
                    alert("Successfully Invoice Created!")
                    this.setState({
                        isRedirect: true
                    })
                }).catch(error => {
                    console.log('error from setSubscriptionInvoice', error)
                })
            }
            if (parseInt(this.state.paymentType) === 2){
                const userLocalData = JSON.parse(localStorage.getItem(LOCAL_STORAGE_DATA_KEYNAME));
                const userSubscriptionId  = this.props.packageData.userSubscriptionId;
                const invoiceData = {
                    userId : JSON.stringify(userLocalData.user.id),
                    //paymentMethodId : this.state.paymentMethodId,
                    //paymentType : this.state.paymentType,
                    //invoiceNumber : this.state.invoiceNumber,
                    //invoiceDate : this.state.invoiceDate,
                    //paymentDate : this.state.paymentDate,
                    //paymentStatus : 0,
                    packagePriceId : this.props.packageData.packagePriceId,
                    vat : JSON.stringify(this.props.packageData.vat),
                    subTotal : JSON.stringify(this.props.packageData.subTotal),
                    discount : JSON.stringify(this.props.packageData.discount),
                    total : JSON.stringify(this.props.packageData.total),
                    cycleStartsAt : this.props.packageData.cycleStartsAt,
                    cycleEndDate : this.props.packageData.cycleEndDate
                };
                console.log("submit", invoiceData, userSubscriptionId);
                const requestSubscriptionInvoice = this.props.setSubscriptionInvoice(invoiceData, userSubscriptionId);

                requestSubscriptionInvoice.then( response => {
                    const  subscriptionInvoiceId  = JSON.stringify(response.payload.data.data.id);
                    console.log("Successfully Invoice Created!", response);

                    this.props.setSubscriptionInvoiceSSL(subscriptionInvoiceId).then(response => {
                        console.log("Successfully setSubscriptionInvoiceSSL", response);
                        const sslResponseData = response.payload.data.data;
                        this.setState({
                            sslResponseData: sslResponseData,
                            isOnlinePaymentMethod: true
                        })


                    }).catch(error => {
                        console.log('error from setSubscriptionInvoiceSSL', error)
                    });
                }).catch(error => {
                    console.log('error from setSubscriptionInvoice', error)
                })
            }

        }else{
            console.log("Not Confirmed!!! :( ");
        }
    }


    render() {
        if (this.state.isRedirect) {
            return (<Redirect to={'/payment-plan'} />);
        }

        // if ( this.props.productList == null) {
        //     return <ReactLoading className='relaod-logo-css' type="spinningBubbles" color="#aaaaaa" height={50}
        //                          width={50}/>;
        // }
        return (
            <Fragment>
                <div>
                    <div className="d-flex justify-content-start mb-4 mt-5">
                    </div>
                </div>
                {this.state.isOnlinePaymentMethod === false &&
                    <div className="card mt-3 mb-3 border-0">
                        <div className="card-header text-center" style={{ background: "#33085ddb", color: "white"}}>
                            <h4>Payment Details</h4>
                        </div>
                        <div className="card-body">

                            <div className="row">
                                <div className="form-group col-md-12">
                                    <label className="col-md col-form-label"><strong>Service Name</strong> : {this.props.packageData.packageName} </label>
                                    <label className="col-md col-form-label"><strong>Service Duration</strong> : {this.props.packageData.priceCycle} Day(s)</label>
                                    <label className="col-md col-form-label"><strong>Service Price</strong> : BDT. {this.props.packageData.price} </label>
                                    <label className="col-md col-form-label"><strong>Discount (-)</strong> : BDT. {this.props.packageData.discount} </label>
                                    <label className="col-md col-form-label"><strong>Subtotal</strong> : BDT. {this.props.packageData.subTotal} </label>
                                    <label className="col-md col-form-label"><strong>Vat</strong> : BDT. {this.props.packageData.vat} </label>
                                    <label className="col-md col-form-label"><strong>Total</strong> : BDT. {this.props.packageData.total} </label>

                                    <div className="pt-1 pb-1 pl-3" style={{ background: "#ddd"}}><h5>Please Select a Payment Method</h5></div>
                                    <div className="form-group pt-1 pb-1 pl-3">
                                        <div className="radio-box">
                                            <label className="radio-inline">
                                                <input
                                                    type="radio"
                                                    value="1"
                                                    name="paymentType"
                                                    required=""
                                                    onChange={this.onChangeHandler}
                                                />Cash
                                            </label>
                                        </div>
                                        <div className="radio-box">
                                            <label className="radio-inline">
                                                <input
                                                    type="radio"
                                                    value="2"
                                                    name="paymentType"
                                                    required=""
                                                    onChange={this.onChangeHandler}
                                                />Online
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="d-flex justify-content-start">
                                <button className="btn btn-info mr-2" onClick={this.handleSubmit}>Pay</button>
                            </div>
                        </div>
                    </div>
                }

                {this.state.isOnlinePaymentMethod === true && <OnlinePaymentMethod sslData={this.state.sslResponseData}/>}
            </Fragment>
        );
    }
}

function mapStateToProps(state) {
    //console.log("state.payment_method", state.product_reducer.products);
    return {

    };
}

export default connect(mapStateToProps,{setUserSubscription, setSubscriptionInvoice, setSubscriptionInvoiceSSL})(CreateInvoice);

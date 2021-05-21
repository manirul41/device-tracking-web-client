import React, {Component, Fragment} from 'react';
import {connect} from 'react-redux';
import {Field, reduxForm} from 'redux-form';
import {renderField} from "../../reduxFormHelper/renderField";
import {getUserProductList, getUserSubscription} from '../../../actions/product'
import {getSingleUserResidenceAddress} from '../../../actions/user'
import {REQUIRED,} from '../../../utils/customValidation'
import ReactLoading from "react-loading";
import {Redirect} from "react-router";
import CreateInvoice from "./CreateInvoice";
import moment from 'moment'
import {LOCAL_STORAGE_DATA_KEYNAME} from "../../../actions/types";

const initialState = {
    show: false,
    showPayment: false,
    userSubscriptionId: null,
    price: null,
    priceCycle: null,
    packageId: null,
    packageName: null,
    packagePriceId: null,
    discount: null,
    subTotal: null,
    total: null,
    cycleStartsAt: null,
    cycleEndDate: null,
    isRedirect: false,
    userSubscription: undefined
};

class PaymentPackageInfo extends Component {
    constructor(props) {
        super(props);
        this.state = {
            ...initialState
        };
        this.handleTrackerOption = this.handleTrackerOption.bind(this);
        this.handleShow = this.handleShow.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.handlePaymentModel = this.handlePaymentModel.bind(this);
        this.handlePaymentClose = this.handlePaymentClose.bind(this);
        this.handleChangeFrom = this.handleChangeFrom.bind(this);
        this.handlePaymentSubmit = this.handlePaymentSubmit.bind(this);
        this.onChangeHandler = this.onChangeHandler.bind(this);

    }

    componentDidMount() {
        const userLocalData = JSON.parse(localStorage.getItem(LOCAL_STORAGE_DATA_KEYNAME));
        if (userLocalData != null) {
            this.props.getUserProductList(userLocalData.user.id)
            this.props.getSingleUserResidenceAddress(userLocalData.user.id)
            this.props.getUserSubscription(userLocalData.user.id).then(
                response => {
                    let resData = response.payload.data.data.rows;
                    let filterResData = resData[0].subscriptionInvoices;
                    //console.log('user filterResData parsing -----', filterResData);
                    let resData2 = filterResData.length > 0 ? moment(filterResData[filterResData.length - 1].cycleEndDate).format("YYYY-MM-DD") : moment().format("YYYY-MM-DD");

                    this.setState({
                        userSubscription: resData2
                    });

                }
            ).catch(
                error => {
                    console.log('user data parsing error', error);
                }
            );
        }
    }

    handleClose() {
        this.setState({show: false});
    }

    handlePaymentClose() {
        this.setState({showPayment: false});
    }

    handleShow() {
        if (this.props.userResidenceAddressDataResponse.count === 0) {
            alert("Please Add Your Residence Information Address First!");
        } else {
            if (this.state.packagePriceId === null || this.state.cycleStartsAt === null) {
                alert("Please Select Package or Date Properly!");
            } else if (this.state.userSubscription > this.state.cycleStartsAt) {
                alert("Please Select Date Properly! Cycle Start Date Must Be Grater Then Future Paid Plan Cycle Expired Date");
            } else if (this.state.packagePriceId === "Invalid date" || this.state.cycleStartsAt === "Invalid date") {
                alert("Please Select Package or Date Properly!");
            } else {
                this.setState({
                    show: !this.state.show,
                });
                this.props.onChangeViewHandler();
            }
        }
    }

    onChangeHandler(event) {
        // this.setState({
        //     [event.target.name] : event.target.value
        // })

        if (event.target.name === 'packagePriceId') {
            if (isNaN(parseInt(event.target.value)) === false) {
                const sliced = [];
                _.map(this.props.productList.rows, (row) => {
                    if (row.package.packagePrices.length > 0) {
                        row.package.packagePrices.map((packagePrice) => {
                            if (packagePrice.id === parseInt(event.target.value)) {
                                sliced.push({
                                    'userSubscriptionId': row.id,
                                    'packageName': row.package.name,
                                    'packageId': packagePrice.packageId,
                                    'price': packagePrice.price,
                                    'priceCycle': packagePrice.priceCycle.cycle,
                                    'vatPercentage': packagePrice.vatPercentage,
                                    'discountPercentage': packagePrice.discountPercentage,
                                });
                            }
                        })
                    }
                });

                let discountAmount = sliced[0].price * sliced[0].discountPercentage / 100;
                let subTotal = sliced[0].price - discountAmount;
                let vatAmount = subTotal * (sliced[0].vatPercentage) / 100;
                let totalAmount = subTotal + vatAmount;

                this.setState({
                    userSubscriptionId: sliced[0].userSubscriptionId,
                    packageId: sliced[0].packageId,
                    packageName: sliced[0].packageName,
                    priceCycle: sliced[0].priceCycle,
                    packagePriceId: event.target.value,
                    price: sliced[0].price,
                    discount: discountAmount,
                    vat: vatAmount,
                    subTotal: subTotal,
                    total: totalAmount,
                })
            } else {
                this.setState({
                    userSubscriptionId: null,
                    packageId: null,
                    packageName: null,
                    priceCycle: null,
                    packagePriceId: null,
                    price: null,
                    discount: null,
                    vat: null,
                    subTotal: null,
                    total: null,
                    //cycleStartsAt: null,
                })
            }
        } else if (event.target.name === 'cycleStartsAt') {
            if (isNaN(parseInt(this.state.packagePriceId)) === false) {
                const sliced = [];
                _.map(this.props.productList.rows, (row) => {
                    if (row.package.packagePrices.length > 0) {
                        row.package.packagePrices.map((packagePrice) => {
                            if (packagePrice.id === parseInt(this.state.packagePriceId)) {
                                sliced.push({
                                    'cycle': packagePrice.priceCycle.cycle,
                                });
                            }
                        })
                    }
                });
                let now = new Date();
                let hours = now.getHours();
                let minutes = now.getMinutes();
                let seconds = now.getSeconds();

                let cycle = sliced[0].cycle;
                let cycleEndDate = moment(event.target.value).add(parseInt(cycle), 'days').add(hours, 'hours').add(minutes, 'minutes').add(seconds, 'seconds').utc().format()

                this.setState({
                    cycleStartsAt: moment(event.target.value).add(hours, 'hours').add(minutes, 'minutes').add(seconds, 'seconds').utc().format(),
                    cycleEndDate: cycleEndDate,
                })
            } else {
                alert("Please select package first.")
            }
        }
    }

    handlePaymentModel() {
        this.setState({
            show: false, showPayment: true
        })
    }

    handleChangeFrom(obj) {
        this.setState({paymentMethod: obj.target.value});
    }

    handlePaymentSubmit() {

    }


    handleTrackerOption() {
        if (this.props.productList.rows.length > 0) {
            const sliced = [];
            _.map(this.props.productList.rows, (row) => {
                if (row.package.packagePrices.length > 0) {
                    row.package.packagePrices.map((packagePrice) => {
                        sliced.push(
                            <option key={packagePrice.id}
                                    value={packagePrice.id}>{row.package.name} {packagePrice.price} Tk./{packagePrice.priceCycle.cycle} Day(s)</option>
                        );
                    })
                }
            });
            return sliced;
        }
    }

    render() {
        if (this.state.isRedirect) {
            return (<Redirect to={'/payment-plan'}/>);
        }
        if (this.props.productList == null) {
            return <ReactLoading className='relaod-logo-css' type="spinningBubbles" color="#aaaaaa" height={50}
                                 width={50}/>;
        }
        return (
            <Fragment>
                {this.state.show === false &&
                <div className="alert alert-warning alert-dismissible fade show mt-2 mb-2" role="alert">
                    <strong><i className="fas fa-exclamation-triangle"/> Buy new Payment Plans </strong>in Advance to
                    prevent un-wanted losing of PTS Service!
                    <button type="button" className="close" data-dismiss="alert" aria-label="Close">
                        {/*<span aria-hidden="true">&times;</span>*/}
                    </button>
                </div>
                }
                {this.state.show === false &&
                <div className="card-group">
                    <div className="card text-center">
                        <div className="card-body col-md-8 offset-2">
                            <strong className="card-title">Pay for your current Product after Selecting Payment Plan &
                                Plan Start Date</strong>
                            <p className="card-text pt-3">
                                <small className="text-muted"><span onClick={this.handleShow}
                                                                    className="btn btn-primary">Pay Now</span></small>
                            </p>
                        </div>
                    </div>
                    <div className="card text-left">
                        <div className="card-body">
                            {/*<h5 className="card-title">Card title</h5>*/}
                            <div className="row justify-content-start">
                                <div className="col-md-8 ml-5">
                                    <label><i className="fas fa-calendar-alt"/><strong> Package</strong></label>
                                    <Field
                                        name="packagePriceId"
                                        className="form-control"
                                        component="select"
                                        required
                                        onChange={this.onChangeHandler}
                                    >
                                        <option value="">Select Payment Plan</option>
                                        {this.handleTrackerOption()}
                                    </Field>
                                </div>
                                <div className="col-md-8 ml-5 mt-2">
                                    <label><i className="fas fa-calendar-alt"/><strong> Select Start
                                        Date</strong></label>
                                    <Field
                                        name="cycleStartsAt"
                                        className="form-control"
                                        id="cycleStartsAt"
                                        component={renderField}
                                        validate={[REQUIRED]}
                                        type="date"
                                        value={this.state.cycleStartsAt}
                                        onChange={this.onChangeHandler}
                                    />
                                    <small id="cycleStartsAt" className="form-text text-muted">Cycle Start Date Must Be Grater Then Future Paid Plan Cycle Expired Date
                                    </small>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                }
                {this.state.show === true &&
                <CreateInvoice packageData={this.state}/>
                }
            </Fragment>
        );
    }
}

function mapStateToProps(state) {
    return {
        productList: state.product.userProducts,
        userResidenceAddressDataResponse: state.user.userResidenceAddressData
    };
}

export default reduxForm({
    form: 'PaymentPackageForm',
})(connect(mapStateToProps, {
    getUserProductList,
    getSingleUserResidenceAddress,
    getUserSubscription
})(PaymentPackageInfo));

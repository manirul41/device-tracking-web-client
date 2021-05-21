import React, {Component, Fragment} from 'react';
import {connect} from 'react-redux';
import ReactLoading from "react-loading";
import {Redirect} from "react-router";
import moment from 'moment'
import {LOCAL_STORAGE_DATA_KEYNAME} from "../../../actions/types";
import {getSingleUserInvoices, setSubscriptionInvoiceSSL} from '../../../actions/product'
import OnlinePaymentMethod from "./OnlinePaymentMethod";
import Pagination from "react-bootstrap/Pagination";
import ViewInvoice from "./ViewInvoice";

const initialState = {
    isOnlinePaymentMethod: false,
    sslResponseData: null,
    dataUser : [],
    isLoadData : '',
    active : 1,
    invoiceRowData : [],
    isViewInvoice: false,
};

let filteredData = [];
let dataUserInit = [];

let page_per_content = 10;


class InvoiceList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            ...initialState
        };
        this.handlePending = this.handlePending.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.renderPerPageRows = this.renderPerPageRows.bind(this);
        this.onChangePage = this.onChangePage.bind(this)
        this.paginationBasic = this.paginationBasic.bind(this)
    }


    componentDidMount() {
        const userLocalData = JSON.parse(localStorage.getItem(LOCAL_STORAGE_DATA_KEYNAME));
        if (userLocalData != null) {
            this.props.getSingleUserInvoices(userLocalData.user.id).then(
                response => {
                    console.log('user data parsing', response.payload.data.data.rows[0]);
                    let resData = response.payload.data.data.rows[0];

                    dataUserInit = resData;
                    filteredData = resData;
                    this.setState({
                        dataUser: resData
                    });

                }
            ).catch(
                error => {
                    console.log('user data parsing error', error);
                }
            );
        }
    }

    onChangePage(value){
        this.setState({
            active: value
        })
    }

    paginationBasic(){
        let items = [];
        let pagination_length = Math.ceil(filteredData.subscriptionInvoices.length/page_per_content);
        for (let number = 1; number <= pagination_length; number++) {
            items.push(
                <Pagination.Item key={number} onClick={ () => this.onChangePage(number)} active={number === this.state.active}>
                    {number}
                </Pagination.Item>,
            );
        }
        return <Pagination size="sm">{items}</Pagination>;
    }

    handlePending(subscriptionInvoiceId) {
        console.log("invoice_id",subscriptionInvoiceId);
        const confirmResponse = confirm("Are you want to pay Online?")
        console.log(confirmResponse);
        if (confirmResponse) {
            this.props.setSubscriptionInvoiceSSL(subscriptionInvoiceId).then(response => {
                console.log("Successfully setSubscriptionInvoiceSSL", response);
                const sslResponseData = response.payload.data.data;
                this.setState({
                    sslResponseData: sslResponseData,
                    isOnlinePaymentMethod: true
                });

            }).catch(error => {
                console.log('error from setSubscriptionInvoiceSSL', error)
            });
        }else{
            console.log("Not Confirmed!!! :( ");
        }


    }

    handleClose(){
        this.setState({
            isOnlinePaymentMethod: false,
            invoiceRowData: [],
            isViewInvoice: false,
        })
    }

    handleViewInvoice(row) {
        console.log("handleViewInvoice", row);
        this.setState({
            invoiceRowData : row,
            isViewInvoice: true
        })
    }


    renderPerPageRows(){
        //console.log(ordered_list);
        let ordered_list = _.orderBy(filteredData.subscriptionInvoices, ['id'], ['desc']);
        let list = ordered_list.slice((this.state.active - 1) * page_per_content, this.state.active * page_per_content);
        return _.map(list, row => {
            return (
                <tr key={row.id}>
                    <td>{row.id}</td>
                    <td>{filteredData.package.name}</td>
                    <td>{row.invoiceNumber}</td>
                    <td>{moment(row.cycleEndDate, "YYYY-MM-DD").format("YYYY-MM-DD")}</td>
                    <td>BDT {row.total}</td>
                    {
                        row.paymentStatus === false &&
                        <td>
                            <span onClick={() => this.handlePending(row.id)} className="col-md-4 btn btn-sm mr-1 btn-danger">Pending</span>
                            <span onClick={() => this.handleViewInvoice(row)} className="col-md-4 btn btn-sm btn-outline-primary">View</span>
                        </td>
                    }
                    {
                        row.paymentStatus === true &&
                        <td>
                            <span className="col-md-4 btn btn-sm mr-1 btn-success">Paid</span>
                            <span onClick={() => this.handleViewInvoice(row)} className="col-md-4 btn btn-sm btn-outline-primary">View</span>
                        </td>
                    }
                </tr>
            );
        });
    }

    render() {
        console.log("this.state.invoiceRowData", this.state);
        if (this.state.isRedirect) {
            return (<Redirect to={'/payment-plan'} />);
        }
        if (this.state.dataUser.length === 0) {
            return <ReactLoading className='relaod-logo-css' type="spinningBubbles" color="#aaaaaa" height={50}
                                 width={50}/>;
        }
        return (
            <Fragment>
                {this.state.isOnlinePaymentMethod === false &&
                    <div className="card mt-2 mb-2">
                        <div className="card-header">
                            <strong>User Invoice</strong>
                        </div>
                        <div className="card-body">
                            <table className="table table-hover">
                                <thead className="table-info">
                                <tr>
                                    <th scope="col">#</th>
                                    <th scope="col">Product</th>
                                    <th scope="col">Invoice Id</th>
                                    <th scope="col">Expired Date</th>
                                    <th scope="col">Payment</th>
                                    <th scope="col">Action</th>
                                </tr>
                                </thead>
                                <tbody>
                                {this.state.dataUser.subscriptionInvoices.length > 0 && this.renderPerPageRows() }
                                </tbody>
                            </table>
                            <div className="d-flex flex-wrap">
                                {this.state.dataUser.subscriptionInvoices.length > 0 && this.paginationBasic()}
                            </div>
                        </div>
                    </div>
                }

                {this.state.isViewInvoice === true && this.state.invoiceRowData.length !== 0 && <ViewInvoice invoiceRowData={this.state.invoiceRowData} handleClose={this.handleClose}/>}

                {this.state.isOnlinePaymentMethod === true && <OnlinePaymentMethod sslData={this.state.sslResponseData}/>}
            </Fragment>
        );
    }
}

// function mapStateToProps(state) {
//     console.log("state.payment_method", state.product.invoices);
//     return {
//         Invoices: state.product.invoices
//     };
// }

export default connect(null, {getSingleUserInvoices, setSubscriptionInvoiceSSL})(InvoiceList);

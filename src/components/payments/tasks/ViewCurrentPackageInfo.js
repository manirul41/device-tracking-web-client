import React, {Component, Fragment} from 'react';
import {connect} from 'react-redux';
import {LOCAL_STORAGE_DATA_KEYNAME} from "../../../actions/types";
import {getUserSubscription} from "../../../actions/product"
import ReactLoading from 'react-loading';
import moment from 'moment'

const initialState = {
    userSubscription: undefined
};

class ViewCurrentPackageInfo extends Component {
    constructor(props) {
        super(props);
        this.state = {
            ...initialState
        };
        this.handleTrackerOption = this.handleTrackerOption.bind(this);
    }

    componentDidMount() {
        const userLocalData = JSON.parse(localStorage.getItem(LOCAL_STORAGE_DATA_KEYNAME));
        if (userLocalData != null) {
            this.props.getUserSubscription(userLocalData.user.id).then(
                response => {
                    console.log('user data parsing', response.payload.data.data.rows);
                    let resData = response.payload.data.data.rows;
                    let filterResData = resData[0].subscriptionInvoices.filter(row => moment(row.cycleStartsAt).format('YYYY-MM-DD HH:mm:ss') <= moment().format('YYYY-MM-DD HH:mm:ss') && moment(row.cycleEndDate).format('YYYY-MM-DD HH:mm:ss') >= moment().format('YYYY-MM-DD HH:mm:ss') );
                    //console.log('user filterResData parsing----', filterResData);
                    this.setState({
                        userSubscription: filterResData
                    });
                    console.log(resData);

                }
            ).catch(
                error => {
                    console.log('user data parsing error', error);
                }
            );
        }
    }

    handleTrackerOption() {
        const sliced = [];
        // if (this.state.TrackerData.length <= 0) {
        //     console.log(this.props.singleUserTrackers.UserTrackers);
        //     for (let i = 0; i < this.props.singleUserTrackers.UserTrackers.rows.length; i++) {
        //         sliced.push({
        //             value: this.props.singleUserTrackers.UserTrackers.rows[i].trackerId,
        //             label: this.props.singleUserTrackers.UserTrackers.rows[i].tracker.trackerConfiguration != null ? this.props.singleUserTrackers.UserTrackers.rows[i].tracker.trackerConfiguration.givenName : `'Tracker' ${i}`
        //         });
        //     }
        //     //this.setState({ isLoadTracker: true });
        // }
    }

    render() {
        console.log("userSubscription", this.state.userSubscription)
        if (this.state.userSubscription === undefined) {
            return <ReactLoading className='relaod-logo-css' type="spinningBubbles" color="#aaaaaa" height={50} width={50} />;
        }
        return (
            <Fragment>
                <div className="card" >
                    <div className="card-header">
                        Product Information
                    </div>
                    {this.state.userSubscription.length > 0 &&
                        <div className="card-body">
                            <h5 className="card-title">Current Product Type: <span className="card-subtitle mb-2 text-muted">{this.state.userSubscription[0].subscription.package.name}</span></h5>
                            <h5 className="card-title">Current Plan: <span className="card-subtitle mb-2 text-muted">{this.state.userSubscription.length > 0 ? this.state.userSubscription[0].packagePrice.priceCycle.cycle + " Day(s)/" + this.state.userSubscription[0].packagePrice.price + "Tk." : "Not Available"} </span></h5>
                            <h5 className="card-title">Subscriptions Status: <span className="card-subtitle mb-2 text-muted">{parseInt(moment(this.state.userSubscription[0].cycleEndDate).diff(moment(),'seconds')) > 0 ? 'Active' : 'Inactive' } </span></h5>
                            <h5 className="card-title">Max Tracker Configurable: <span className="card-subtitle mb-2 text-muted">{this.state.userSubscription[0].subscription.package.maxTrackers > 0 ? this.state.userSubscription[0].subscription.package.maxTrackers : 0}</span></h5>
                            <small className="card-title mr-2">Subscription Start: <span className="card-subtitle mb-2 ml-2 text-muted">{this.state.userSubscription.length > 0 ? moment(this.state.userSubscription[0].subscription.startDate, "YYYY-MM-DD").format("YYYY-MM-DD") : "No Active Subscription"}</span></small>
                            <small className="card-title mr-2">Cycle Expired: <span className="card-subtitle mb-2 ml-2 text-muted">{this.state.userSubscription.length > 0 ? moment(this.state.userSubscription[0].cycleEndDate, "YYYY-MM-DD").format("YYYY-MM-DD") : "No Active Subscription"}</span></small>
                            {/*<small className="card-title">Subscription End: <span className="card-subtitle mb-2 text-muted">{moment(this.props.userSubscription.rows[0].endDate, "YYYY-MM-DD").format("YYYY-MM-DD")}</span></small>*/}
                        </div>
                    }
                    {this.state.userSubscription.length === 0 &&
                        <div className="card-body">
                            <h4>Subscription Not Available!!</h4>
                        </div>
                    }
                </div>
            </Fragment>
        );
    }
}

function mapStateToProps(state) {
    // console.log("userSubscription--------",state.product.UserSubscription);
    return {
        userSubscription : state.product.UserSubscription
    };
}

export default connect(mapStateToProps, { getUserSubscription })(ViewCurrentPackageInfo);

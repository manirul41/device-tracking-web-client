import React, {Component, Fragment} from 'react';
import NavBarMenuWrapper from './NavBarMenuWrapper';
import {LOCAL_STORAGE_DATA_KEYNAME} from "../../actions/types";
import {getUserSubscription} from "../../actions/product"
import moment from 'moment'
import {connect} from "react-redux";

const initialState = {
  userSubscription: undefined
};

class NavBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ...initialState
    };
  }

  componentDidMount() {
    const userLocalData = JSON.parse(localStorage.getItem(LOCAL_STORAGE_DATA_KEYNAME));
    if (userLocalData != null) {
      //this.props.getUserSubscription(userLocalData.user.id)
      this.props.getUserSubscription(userLocalData.user.id).then(
          response => {
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

  render() {
    return (   
      <div className="main-navbar">      
      <nav className="navbar default-layout-navbar  col-12 p-0  d-flex flex-row mb-1" style={{ background: "#4f2973" }}>
        <div className="navbar-searchbox d-flex align-items-center justify-content-center ml-4 ">
            {/*<img src="../../images/searchicon1.png" alt='Search Icon' width="20" />*/}
            {/*<input */}
                {/*className="text-line-searchfield" */}
                {/*placeholder="Search anything you like"*/}
            {/*/> */}
          {this.state.userSubscription !== undefined && this.state.userSubscription.length > 0 &&
          <Fragment>
            <h6 className="card-title mb-0" style={{color: 'white'}}>Subscriptions Status: <span className="badge badge-info p-2">{parseInt(moment(this.state.userSubscription[0].cycleEndDate).diff(moment(),'seconds')) > 0 ? 'Active' : 'Inactive' } </span></h6>
            <h6 className="card-title mr-2 ml-2 mb-0" style={{color: 'white'}}>Cycle Expired: <span className="badge badge-info p-2 ml-2">{this.state.userSubscription.length > 0 ? moment(this.state.userSubscription[0].cycleEndDate, "YYYY-MM-DD").format("YYYY-MM-DD") : "No Active Subscription"}</span></h6>
          </Fragment>
          }
          {this.state.userSubscription !== undefined && this.state.userSubscription.length === 0 &&
          <Fragment>
            <h6 className="card-title mb-0" style={{color: 'white'}}><span className="badge badge-danger p-2">Subscription Not Available!!</span></h6>
          </Fragment>
          }
        </div>   

        <NavBarMenuWrapper />   

      </nav>    
      </div>
    );
  }
}

export default connect(null, { getUserSubscription })(NavBar);

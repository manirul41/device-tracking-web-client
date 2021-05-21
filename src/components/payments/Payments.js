import React, { Component } from 'react';
import SidebarView from '../common/SidebarView';
import NavBar from '../common/NavBar';
import ViewCurrentPackageInfo from "./tasks/ViewCurrentPackageInfo";
import PaymentPackageInfo from "./tasks/PaymentPackageInfo";
import InvoiceList from "./tasks/InvoiceList";


const initialState = {
    isView: true,
};

class Payments extends Component {
    constructor(props){
        super(props);
        this.state = {
            ...initialState
        };
        this.onChangeViewHandler = this.onChangeViewHandler.bind(this);
    }

    onChangeViewHandler(){
        this.setState({
            isView: !this.state.isView,
        })
    }

  render() {
    return (
      <div id="wrapper" className="toggled">
        <SidebarView selected="/payment-plan" />
        <div id="page-content-wrapper " className="">
          <NavBar />
          <div className="container-fluid ">
            <h1>Payments</h1>
              {this.state.isView && <ViewCurrentPackageInfo />}
              <PaymentPackageInfo onChangeViewHandler={this.onChangeViewHandler}/>
              {this.state.isView && <InvoiceList />}
          </div>
        </div>
      </div>
    );
  }
}

export default Payments ;

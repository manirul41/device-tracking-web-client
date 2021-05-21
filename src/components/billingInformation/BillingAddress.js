import React, { Component } from 'react';
import SidebarView from '../common/SidebarView';
import NavBar from '../common/NavBar';
import ViewAddressData from './task/ViewAddressData';
import EditAddress from './task/EditAddress';
import CreateAddress from './task/CreateAddress';

const initialState = {
    isViewAddress: true,
    isEditAddress: false,
    isViewEditButton: true,
    isCreateAddress: false,
    posts: null
};

class BillingAddress extends Component {
    constructor(props) {
        super(props);
        this.state = {
            ...initialState
        };
        this.clickEdit = this.clickEdit.bind(this);
        this.clickCreate = this.clickCreate.bind(this);
    }

    clickEdit(obj) {
        Object.keys(obj).forEach((key) => {
            const val = obj[key];
            if (val == null || val === undefined) {
                obj[key] = '';
            }
        });
        this.setState({
            isViewAddress: false,
            isEditAddress: true,
            isViewEditButton: false,
            isCreateAddress: false,
            posts: obj
        });
    }

    clickCreate() {
        this.setState({
            isViewAddress: false,
            isEditAddress: false,
            isViewEditButton: false,
            isCreateAddress: true
        });
    }

    render() {
        return (
            <div id="wrapper" className="toggled">
                <SidebarView selected="/" />
                <div id="page-content-wrapper " className="">
                    <NavBar />
                    <div className="container-fluid ">
                        <h1>BillingAddress</h1>
                        {this.state.isViewAddress &&
                                                    <ViewAddressData 
                                                        triggerParentUpdate={this.clickEdit}
                                                        triggerCreate={this.clickCreate} 
                                                    />}
                        {this.state.isEditAddress && (<EditAddress posts={this.state.posts} />)}
                        {this.state.isCreateAddress && (<CreateAddress />)}
                    </div>
                </div>
            </div>
        );
    }
}

export default BillingAddress;

import React, {Component} from 'react';
import SidebarView from '../common/SidebarView';
import NavBar from "../common/NavBar";
import IssueMessagePanel from "./tasks/issueMessage/IssueMessagePanel";

const initialState = {
    isViewUserSetting: true,
    isViewLogManagement: false,
};

class Inbox extends Component {
    constructor(props){
        super(props);
        this.state = {
            ...initialState
        };
        this.onChangeIssueMessage = this.onChangeIssueMessage.bind(this);
        this.onChangeIssueTag = this.onChangeIssueTag.bind(this);
    }

    onChangeIssueMessage() {
        console.log("Clicked----------", this.state)
        this.setState({
            isViewUserSetting: true,
            isViewLogManagement: false,
        })
    }
    onChangeIssueTag() {
        this.setState({
            isViewUserSetting: false,
            isViewLogManagement: true,
        })
    }

    onChangeViewHandler(){
        this.setState({
            isViewPaidInvoice: !this.state.isViewPaidInvoice,
            isViewPendingInvoice: !this.state.isViewPendingInvoice,
        })
    }

    render() {
        return (
            <div id="wrapper" className="toggled">
                <SidebarView selected="/inbox" />
                <div id="page-content-wrapper " className="">
                    <NavBar />
                    <div className="container-fluid">
                        <h1>Issue Page</h1>
                        <div className="row">
                            <div className="col-sm-12">
                                <IssueMessagePanel onChangeViewHandler={this.onChangeViewHandler}/>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Inbox;

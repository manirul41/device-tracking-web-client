import React, {Component, Fragment} from 'react';
import {connect} from "react-redux";
import ReactLoading from 'react-loading';
import {Redirect} from "react-router";
import CreateIssueMessage from "./CreateIssueMessage";
import IssueMessageList from "./IssueMessageList";

const initialState = {
    isShowInvoice: false,
    isViewIssueTag: false,
    isRedirect: false
};

class IssueMessagePanel extends Component {
    constructor(props) {
        super(props);
        this.state = {
            ...initialState
        };
        //this.renderPerPageRows = this.renderPerPageRows.bind(this)
        //this.onChangeUserStatus = this.onChangeUserStatus.bind(this)
        this.onChangeViewHandler = this.onChangeViewHandler.bind(this)
    }

    componentDidMount() {
        //this.props.getAllUserWithRole();
    }

    showInvoice(value) {
        console.log('showInvoice Called!!', value);
        this.setState({
            isShowInvoice: true
        })
    };

    onChangeViewHandler(){
        this.setState({
            isViewIssueTag: !this.state.isViewIssueTag,
        })
    }

    hideInvoice() {
        //console.log('showInvoice Called!!', value);
        this.setState({
            isShowInvoice: false
        })
    };

    // renderPerPageRows() {
    //     const list = this.props.allUsersWithRoleData.rows;
    //     return _.map(list, row => {
    //         return (
    //             <tr key={row.id}>
    //                 <td>{row.id}</td>
    //                 {/*<td>{row.userUniqueId}</td>*/}
    //
    //                 <td>
    //                     {
    //                         _.map(row.userRoles, roles => {
    //                             return <li className="badge badge-pill badge-info mr-1"
    //                                        key={roles.id}>{roles.role.name}</li>
    //                         })
    //                     }
    //                 </td>
    //                 <td>{row.isActive ? <span className="badge badge-pill badge-success">Active</span> :
    //                     <span className="badge badge-pill badge-danger">Inactive</span>}</td>
    //                 <td><span onClick={() => this.onChangeUserStatus(row)} className="btn btn-warning btn-sm col-md-5">Change Status</span>
    //                 </td>
    //             </tr>
    //         );
    //     });
    // }

    render() {
        if (this.state.isRedirect) {
            return (<Redirect to={'/inbox'} />);
        }
        if (this.props.allUsersWithRoleData === null) {
            return <ReactLoading className='relaod-logo-css' type="spinningBubbles" color="#aaaaaa" height={50} width={50} />;
        }
        return (
            <Fragment>
                {this.state.isViewIssueTag === false && <button onClick={this.onChangeViewHandler} className="btn btn-outline-info mb-2">Compose</button>}
                {this.state.isViewIssueTag === false && <IssueMessageList />}
                {this.state.isViewIssueTag === true && <button onClick={this.onChangeViewHandler} className="btn btn-outline-info mb-2">Back</button>}
                {this.state.isViewIssueTag && <CreateIssueMessage />}
            </Fragment>
        );
    }
}


function mapStateToProps(state){
    //console.log('allUsers----------', state.user.allUsersWithRole);
    return {
        //allUsersWithRoleData : state.user.allUsersWithRole
    }
}

export default connect(mapStateToProps,null)(IssueMessagePanel);

import React, {Component, Fragment} from 'react';
import {connect} from "react-redux";
import ReactLoading from 'react-loading';
import {Redirect} from "react-router";
import moment from 'moment';
import getUserDataFromLS from "../../../../utils/getUserDataFromLS";
import {getAllIssueMessage} from '../../../../actions/issue'
import SingleIssueMessage from "./SingleIssueMessage";


const initialState = {
    IssueMessage:null,
    isViewSingleIssueMessage: false,
    isRedirect: false
};


class IssueMessageList extends Component {
    constructor(props){
        super(props);
        this.state = {
            ...initialState
        };
        this.renderPerPageRows = this.renderPerPageRows.bind(this)
        this.onClickDeleteHandler = this.onClickDeleteHandler.bind(this)
        this.handleIssueMessage = this.handleIssueMessage.bind(this)
    }

    componentDidMount() {
        this.props.getAllIssueMessage(JSON.stringify(getUserDataFromLS().user.id))
    }

    handleIssueMessage(value){
        this.setState({
            isViewSingleIssueMessage: true,
            IssueMessage: value
        })
      //console.log(value)
    }

    onClickDeleteHandler(value) {
        //console.log(value.id)
        const isConfirm = confirm('Are you sure to delete Issue Tag?');

        if (isConfirm === true) {
            const request = this.props.deleteIssueTag(value.id);
            request.then( response => {
                console.log("Issue Tag Deleted Successfully!", response)
                alert('Issue Tag Deleted Successfully!');
                this.setState({
                    isRedirect: true
                })
            }).catch(error => {
                alert('Issue Tag Deletion Failed!', error);
            })
        }

    }


    renderPerPageRows() {
        const list = this.props.userAllIssueMessageResponse.rows;
        return _.map(list, row => {
            if (row.issueMessages.length > 0) {

                return (
                    <tr onClick={() => this.handleIssueMessage(row)} style={{ 'cursor' : 'pointer'}} key={row.issueMessages[row.issueMessages.length-1].id}>
                        <td style={{'background':'#f1f1f9', 'borderBottom': '1px solid #cecbcb'}}>
                            <div className="d-flex justify-content-between">
                                <span>{row.issueTag.name}</span>
                                <label>Issue Id: {row.issueMessages[row.issueMessages.length-1].issueId}</label>
                            </div>
                            <small>{moment(row.issueMessages[row.issueMessages.length-1].time).utcOffset(row.issueMessages[row.issueMessages.length-1].time).format("dddd, MMMM Do YYYY, h:mm:ss a")}</small><br/>
                            <small className="text-muted">
                                {row.issueMessages[row.issueMessages.length-1].userId === getUserDataFromLS().user.id ? <i className="fas fa-level-up-alt pr-2"/> : <i className="fas fa-level-down-alt pr-2"/>}
                                <strong>{row.issueMessages[row.issueMessages.length-1].message.substr(0, 50)}</strong>
                            </small>
                        </td>
                    </tr>
                );

            }
        });
    }


    render() {
        if (this.state.isRedirect) {
            return (<Redirect to={'/inbox'} />);
        }
        if (this.props.userAllIssueMessageResponse == null) {
            return <ReactLoading className='relaod-logo-css' type="spinningBubbles" color="#aaaaaa" height={50} width={50} />;
        }
        return (
            <Fragment>
                <div className="card mt-20" style={{ 'height' : '500px'}}>
                    <div className="card-body">
                        <div className="row">
                            <div className="col-md-5" style={{ 'maxHeight' : '400px', 'overflow': 'auto'}}>
                                <table className="table">
                                    <thead>
                                    <tr>
                                        <th className="pt-0 pb-2" style={{ 'borderTop' : '0'}}>Inbox</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {this.renderPerPageRows() }
                                    </tbody>
                                </table>
                            </div>
                            <div className="col-md-7">
                                {this.state.isViewSingleIssueMessage && <SingleIssueMessage IssueMessage={this.state.IssueMessage} />}
                            </div>

                        </div>
                    </div>
                </div>
            </Fragment>
        );
    }
}

function mapStateToProps(state){
    //console.log("All Issue Message Data", state.issue.userAllIssueData);
    return {
        userAllIssueMessageResponse : state.issue.userAllIssueData
    };
}

export default connect(mapStateToProps,{getAllIssueMessage})(IssueMessageList);

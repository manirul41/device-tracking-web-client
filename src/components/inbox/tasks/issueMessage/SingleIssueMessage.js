import React, {Component, Fragment} from 'react';
import {connect} from "react-redux";
import ReactLoading from 'react-loading';
import {Redirect} from "react-router";
import moment from 'moment';
import getUserDataFromLS from "../../../../utils/getUserDataFromLS";
import {setIssueMessageReply} from '../../../../actions/issue'

const initialState = {
    message: '',
    isViewIssueTag: false,
    isRedirect: false
};

class SingleIssueMessage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            ...initialState
        };
        this.renderPerPageRows = this.renderPerPageRows.bind(this)
        this.onChangeHandler = this.onChangeHandler.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentDidMount() {
        //this.props.getAllUserWithRole();
        this.setState({
            userId: getUserDataFromLS().user.id
        })
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.IssueMessage.id !== this.props.IssueMessage.id) {
            this.setState({
                message: ''
            })
        }
    }

    onChangeHandler(event) {
        this.setState({
            [event.target.name]: event.target.value
        })
    }

    handleSubmit() {
        //console.log(this.state);
        const {userId,message} = this.state;
        if (this.props.IssueMessage.id !== null && this.props.IssueMessage.issueMessages[0].id !== null && this.state.message !== '') {

            const issueMessageReplyData = {
                userId: JSON.stringify(userId),
                issueId: JSON.stringify(this.props.IssueMessage.id),
                issueMessageId: JSON.stringify(this.props.IssueMessage.issueMessages[0].id),
                message: message,
                time: moment().format("YYYY-MM-DD HH:mm:ss"),
            }
            console.log('issueMessageReplyData', issueMessageReplyData)
            this.props.setIssueMessageReply(issueMessageReplyData).then(response => {
                console.log("Successfully Created Issue Message", response);
                alert('Issue Message Created Successfully!');
                this.setState({
                    isRedirect: true
                })
            }).catch(error => {
                console.log('error from creating issue message', error)
            });


        } else {
            alert("Request Not Complete!!");
        }
    }

    renderPerPageRows() {
        const list = this.props.IssueMessage;
        return _.map(list.issueMessages, row => {
            if (getUserDataFromLS().user.id === row.userId) {
                return (
                    <tr style={{'borderBottom': '8px solid #ffffff'}} key={row.id}>
                        <td style={{'background': '#f9f8f9'}}>
                            {/*<h6>{row.userId}</h6>*/}
                            <h6>Me</h6>
                            <small>{moment(row.time).utcOffset(row.time).format("dddd, MMMM Do YYYY, h:mm:ss a")}</small>
                            <hr/>
                            <small className="text-muted">
                                {row.message}
                            </small>
                        </td>
                    </tr>
                );
            }else {
                return (
                    <tr className="text-right" style={{'borderBottom': '8px solid #ffffff'}} key={row.id}>
                        <td style={{'background': '#ecdbf5'}}>
                            {/*<h6>{row.userId}</h6>*/}
                            <h6>Admin</h6>
                            <small>{moment(row.time).utcOffset(row.time).format("dddd, MMMM Do YYYY, h:mm:ss a")}</small>
                            <hr/>
                            <small className="text-muted">
                                {row.message}
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
        // if (this.props.allUsersWithRoleData === null) {
        //     return <ReactLoading className='relaod-logo-css' type="spinningBubbles" color="#aaaaaa" height={50} width={50} />;
        // }
        return (
            <Fragment>
                <div>
                    <label>Issue Id: {this.props.IssueMessage.id}</label>
                    <span className="badge badge-primary ml-2">{this.props.IssueMessage.issueTag.name}</span>
                </div>
                <div style={{ 'height' : '400px', 'overflow': 'auto'}}>
                    <table className="table table-borderless">
                        <tbody>
                        {this.renderPerPageRows() }
                        </tbody>
                    </table>

                    <div className="form-group">
                        <label htmlFor="exampleFormControlTextarea1">Reply</label>
                        <textarea
                            name="message"
                            value={this.state.message}
                            className="form-control"
                            id="exampleFormControlTextarea1"
                            onChange={this.onChangeHandler}
                            rows="3"/>
                        <button onClick={this.handleSubmit} className="btn btn-primary btn-sm mt-2">Send</button>
                    </div>

                </div>
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

export default connect(mapStateToProps,{setIssueMessageReply})(SingleIssueMessage);

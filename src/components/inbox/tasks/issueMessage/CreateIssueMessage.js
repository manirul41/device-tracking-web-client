import React, {Component, Fragment} from 'react';
import {connect} from 'react-redux';
import {Field, reduxForm} from "redux-form";
import Select from 'react-select'
import {Redirect} from "react-router";
import ReactLoading from 'react-loading';
import moment from 'moment';
import {renderField} from "../../../reduxFormHelper/renderField";
import {
    REQUIRED,
    MAX_LENGTH,
    MIN_LENGTH,
    NUMBER,
} from '../../../../utils/customValidation';
import {getAllIssueTags, setIssue, setIssueMessage} from '../../../../actions/issue'
import getUserDataFromLS from "../../../../utils/getUserDataFromLS";


const initialState = {
    userId: null,
    issueTagId: null,
    trackerId: null,
    ticket: null,
    time: null,
    message: null,
    issueMessageId: null,
    isRedirect: false
};


class CreateIssueMessage extends Component {
    constructor(props){
        super(props);
        this.state = {
            ...initialState
        };
        this.myForm = React.createRef();
        this.onChangeHandler = this.onChangeHandler.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleIssueTagOption = this.handleIssueTagOption.bind(this);
    }

    componentDidMount() {
        this.props.getAllIssueTags()
        this.setState({
            userId: getUserDataFromLS().user.id
        })
    }

    onChangeHandler(event) {
        this.setState({
            [event.target.name]: event.target.value
        })
    }

    handleSubmit() {
        console.log(this.state);
        const {issueTagId, userId, trackerId, message, ticket, time} = this.state;
        const issueData = {
            issueTagId: issueTagId,
            userId: JSON.stringify(userId),
            trackerId: trackerId,
            ticket: Math.random().toString(36).substr(2, 5),
            time: moment().format("YYYY-MM-DD HH:mm:ss"),
        }
        console.log("dddddddd", issueData);
        if (issueTagId !== null && trackerId !== null) {
            console.log('valid user', issueData)

            const request = this.props.setIssue(issueData);
            request.then(response => {
                console.log("Issue Created Successfully!", response)
                //alert('Issue Created Successfully!');
                const issueMessageData = {
                    userId: JSON.stringify(userId),
                    issueId: JSON.stringify(response.payload.data.data.id),
                    message: message,
                    time: moment().format("YYYY-MM-DD HH:mm:ss"),
                }
                this.props.setIssueMessage(issueMessageData).then(response => {
                    console.log("Successfully Created Issue Message", response);
                    alert('Issue Message Created Successfully!');
                    this.setState({
                        isRedirect: true
                    })
                }).catch(error => {
                    console.log('error from creating issue message', error)
                });
            }).catch(error => {
                alert('Issue Creation Failed!', error);
                this.setState({
                    userId: null,
                    issueTagId: null,
                    trackerId: null,
                    ticket: null,
                    time: null,
                    message: null,
                    issueMessageId: null,
                    isRedirect: true
                })
            })


        } else {
            alert("Request Already Send!");
        }
    }

    handleIssueTagOption() {
        console.log(this.props.allIssueTagResponse);
        if (this.props.allIssueTagResponse.rows.length > 0) {
            const sliced = [];
            _.map(this.props.allIssueTagResponse.rows, (row) => {
                sliced.push(
                    <option key={row.id} value={row.id}>{row.name}</option>
                );
            });
            console.log("allIssueTagResponse", sliced)
            return sliced;
        }
    }

    render() {
        if (this.state.isRedirect) {
            return (<Redirect to={'/inbox'} />);
        }
        if (this.props.allIssueTagResponse == null) {
            return <ReactLoading className='relaod-logo-css' type="spinningBubbles" color="#aaaaaa" height={50} width={50} />;
        }
        const {handleSubmit, pristine, reset, submitting} = this.props;
        return (
            <Fragment>
                <div className="col-md-8 offset-2">
                    <div className="card mt-2">
                        <div className="card-header">
                            Compose New Message
                        </div>
                        <div className="card-body">
                            <form ref={this.myForm} className="form-group" onSubmit={handleSubmit(this.handleSubmit)}>
                                <div className="form-group">
                                    <label htmlFor="exampleInputEmail1">Select Issue Name</label>
                                    <Field
                                        name="issueTagId"
                                        className="form-control"
                                        component="select"
                                        required
                                        onChange={this.onChangeHandler}
                                        aria-describedby="issueTagIdHelp"
                                    >
                                        <option value="">Select Issue Name</option>
                                        {this.handleIssueTagOption()}
                                    </Field>
                                    <small id="issueTagIdHelp" className="form-text text-muted">*Select Issue Tag
                                    </small>
                                </div>
                                <div className="form-group">
                                    <label htmlFor="exampleInputEmail1">Tracker Id</label>
                                    <Field
                                        name="trackerId"
                                        className="form-control"
                                        component={renderField}
                                        validate={[REQUIRED]}
                                        type="number"
                                        required
                                        onChange={this.onChangeHandler}
                                        aria-describedby="trackerIdHelp"
                                    />
                                    <small id="trackerIdHelp" className="form-text text-muted">*Enter valid tracker id.
                                    </small>
                                </div>
                                <div className="form-group">
                                    <label htmlFor="exampleInputEmail1">Message</label>
                                    <textarea
                                        name="message"
                                        className="form-control"
                                        required
                                        onChange={this.onChangeHandler}
                                        aria-describedby="messageHelp"
                                    />
                                    <small id="messageHelp" className="form-text text-muted">* Enter message details.
                                    </small>
                                </div>

                                <button className="btn btn-info float-right" type="submit"
                                        disabled={pristine || submitting}>Create</button>
                                <button className="btn btn-light" type="button"
                                        disabled={pristine || submitting} onClick={reset}>Reset
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </Fragment>
        );
    }
}


function mapStateToProps(state){
    console.log("All Issue Data", state.issue.allIssueTagData);
    return {
        allIssueTagResponse : state.issue.allIssueTagData
    };
}


function validate(values) {
    const errors = {};
    if (!values.name) {
        errors.name = 'Please enter valid tag name.';
    }
    if (!values.detail) {
        errors.detail = 'Please enter a tag detail';
    }
    if (!values.message) {
        errors.message = 'Please enter a tag detail';
    }
    return errors;
}

CreateIssueMessage = reduxForm({
    // a unique name for the form
    form: 'CreateIssueMessagesForm',
    enableReinitialize: false,
    Field,
    Select,
    validate,
    initialValues: { name: '', detail: '' }
})(CreateIssueMessage);

export default connect(mapStateToProps,{getAllIssueTags,setIssue, setIssueMessage})(CreateIssueMessage)

import React, {Component, Fragment} from 'react';
import {Field, reduxForm} from 'redux-form';
import {renderField} from '../../reduxFormHelper/renderField';
import {setTrackerConfiguration, updateTrackerConfiguration} from '../../../actions/tracker';
import {connect} from "react-redux";
import {Redirect} from "react-router";


const required = value => (value ? undefined : 'Required');

class GeneralForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            activePage: 1,
            givenName: '',
            assignedTo: '',
            excessiveIdleTime: '',
            isReload: false,
        };
        this.handleGeneralSubmit = this.handleGeneralSubmit.bind(this);
        this.onChangeHandler = this.onChangeHandler.bind(this);
    }

    componentDidMount() {
        console.log(this.props);
        this.props.initialize({
            givenName: this.props.tracker.trackerConfiguration != null ? this.props.tracker.trackerConfiguration.givenName : '',
            assignedTo: this.props.tracker.trackerConfiguration != null ? this.props.tracker.trackerConfiguration.assignedTo : '',
            excessiveIdleTime: this.props.tracker.trackerConfiguration != null ? this.props.tracker.trackerConfiguration.excessiveIdleTime : ''
        });

        if (this.props.tracker.trackerConfiguration != null) {
            this.setState({
                givenName: this.props.tracker.trackerConfiguration.givenName,
                assignedTo: this.props.tracker.trackerConfiguration.assignedTo,
                excessiveIdleTime: this.props.tracker.trackerConfiguration.excessiveIdleTime,
            })
        }

        //this.props.initialize({ assignedTo: this.props.tracker.trackerConfiguration != null ? this.props.tracker.trackerConfiguration.assignedTo : ''});
        // set the value individually
        //this.props.dispatch(change('myFormName', 'anotherField', 'value'));
    }

    handleGeneralSubmit() {
        const tracker_id = this.props.tracker.id;
        let requestedData = {
            "givenName": `${this.state.givenName}`,
            "assignedTo": `${this.state.assignedTo}`,
            "excessiveIdleTime": `${this.state.excessiveIdleTime}`,
        };

        if (this.props.tracker.trackerConfiguration != null) {
            //console.log("body", requestedData);
            const config_id = this.props.tracker.trackerConfiguration.id;
            const request = this.props.updateTrackerConfiguration(requestedData, tracker_id, config_id);

            request.then(result => {
                if (window.confirm('Success!')) {
                    this.setState({isReload: true});
                }
            }).catch(error => {
                alert('Error Occured', error);
            });
        } else {
            console.log("body", requestedData);
            const request = this.props.setTrackerConfiguration(requestedData, tracker_id);

            request.then(result => {
                if (window.confirm('Success!')) {
                    this.setState({isReload: true});
                }
            }).catch(error => {
                alert('Error Occured', error);
            });
        }
        // const body = JSON.parse(requestedData);

    }

    onChangeHandler(event) {
        this.setState({
            [event.target.name]: event.target.value
        })
    }

    render() {
        console.log('GeneralForm  ==== ', this.props);
        if (this.state.isReload) {
            return (<Redirect to={'/configure-tracker'}/>);
        }
        const {handleSubmit, pristine, reset, submitting} = this.props;
        return (
            <Fragment>
                <form className="form-group pt-2" onSubmit={handleSubmit(this.handleGeneralSubmit)}>
                    <div className="form-group row">
                        <label htmlFor="givenName2" className="col-md-3 col-form-label">Tracker Name</label>
                        <div className="col-md-9">
                            <Field
                                name="givenName"
                                className="form-control"
                                component={renderField}
                                validate={required}
                                type="text"
                                placeholder="Enter Tracker Name"
                                onChange={this.onChangeHandler}
                            />
                        </div>
                    </div>
                    <div className="form-group row">
                        <label htmlFor="trackerName" className="col-md-3 col-form-label">Assigned To</label>
                        <div className="col-md-9">
                            <Field
                                name="assignedTo"
                                className="form-control"
                                component={renderField}
                                validate={required}
                                type="text"
                                placeholder="Enter Assigned User Name"
                                onChange={this.onChangeHandler}
                            />
                        </div>
                    </div>
                    <div className="form-group row">
                        <label htmlFor="excessiveIdleTime" className="col-md-3 col-form-label">Excessive Idle
                            Time</label>
                        <div className="col-md-9">
                            <Field
                                name="excessiveIdleTime"
                                className="form-control"
                                component={renderField}
                                validate={required}
                                type="number"
                                placeholder="Enter Excessive Idle Time in Minutes"
                                onChange={this.onChangeHandler}
                            />
                        </div>
                    </div>

                    <div className="row d-flex justify-content-between">
                        <span onClick={this.props.veiwTracker} className="col-md-2 btn btn-primary">Back</span>
                        <button className="btn btn-primary" type="submit">Save Changes</button>
                    </div>
                </form>
            </Fragment>
        );
    }
}

// function mapStateToProps(state) {
//   console.log('GeneralForm promotion === ', promotion);
//   return {
//     totalRowNo: _.isEmpty(promotion) ? 0 : promotion.totalRowNo,
//     perPageRows: _.isEmpty(promotion) ? [] : promotion.perPageRows
//   };
// }

function validate(values) {
    //console.log('inside validate === ', values);
    const errors = {};
    if (!values.givenName) {
        errors.givenName = 'Enter Tracker Name';
    }
    if (!values.assignedTo) {
        errors.assignedTo = 'Enter Assigned User Name';
    }
    if (!values.excessiveIdleTime) {
        errors.excessiveIdleTime = 'Enter Excessive Idle Time in Minutes';
    }
    return errors;
}

GeneralForm = reduxForm({
    // a unique name for the form
    form: 'generalForm',
    enableReinitialize: false,
    Field,
    validate,
})(GeneralForm);


export default connect(null, {setTrackerConfiguration, updateTrackerConfiguration})(GeneralForm);


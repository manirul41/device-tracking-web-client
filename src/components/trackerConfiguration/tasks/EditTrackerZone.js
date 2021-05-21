import React, { Component } from 'react';
import { Field, reduxForm, reset } from 'redux-form';
import { renderField } from '../../reduxFormHelper/renderField';
import SetMapCircle from "./SetMapCircle";
import NavBar from "../../common/NavBar";
import SidebarView from "../../common/SidebarView";
import {getSingleTargetTrackerArea, updateTrackerArea} from '../../../actions/tracker';
import {connect} from "react-redux";
import {Redirect} from "react-router";


/*
define custom field validation variable
*/

const required = value => (value ? undefined : 'Required');
const maxLength = max => value => value && value.length > max ? `Must be ${max} characters or less` : undefined;
const maxNumberLength = max => value => value && value.length > max ? `Number Must be ${max} digits or less` : undefined;
const maxLength30 = maxLength(30);
const maxNumberLength5 = maxNumberLength(5);
const maxNumberLength11 = maxNumberLength(11);

export const minLength = min => value => value && value.length < min ? `Must be ${min} characters or more` : undefined;
export const minNumberLength = min => value => value && value.length < min ? `Number Must be ${min} digits or more` : undefined;
export const minLength3 = minLength(3);
export const minLength5 = minLength(5);
export const minNumberLength2 = minNumberLength(2);
export const minNumberLength5 = minNumberLength(5);

const number = value => value && isNaN(Number(value)) ? 'Must be a number' : undefined;
const minValue = min => value => value && value < min ? `Must be at least ${min}` : undefined;
const minValue5 = minValue(5);
const maxValue = max => value => value && value > max ? `Must be ${max} or less` : undefined;
const maxValue11 = maxValue(11);

/*this EditTargetZone function used for Edit existing target area of a tracker*/

class EditTargetZone extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isRedirect: false,
            isChecked: true,
            isSetMapCircle: false,
            radius: 0,
            startTime: '00:00:00',
            endTime: '00:00:00',
            days: [
                {name:'MON', value:false, id:0},
                {name:'TUS', value:false, id:1},
                {name:'WED', value:false, id:2},
                {name:'THU', value:false, id:3},
                {name:'FRY', value:false, id:4},
                {name:'SAT', value:false, id:5},
                {name:'SUN', value:false, id:6},
            ],
            markers:[
                {
                    name: "Current position",
                    position: {
                        lat: 23.750259800750143,
                        lng: 90.40973424911499
                    }
                }
            ]

        };
        this.handleSubmit = this.handleSubmit.bind(this);
        this.renderCheckBoxFields = this.renderCheckBoxFields.bind(this);
        this.onRadiusFieldChange = this.onRadiusFieldChange.bind(this);
        this.setTargeteCircle = this.setTargeteCircle.bind(this);
        this.onMarkerDragEnd = this.onMarkerDragEnd.bind(this);
        this.toggleChange = this.toggleChange.bind(this);
        this.onTimeChange = this.onTimeChange.bind(this);
    }

    componentDidMount() {
        //console.log(this.props);
        const request = this.props.getSingleTargetTrackerArea(this.props.match.params.id, this.props.match.params.zone);
        request.then(
            response => {
                //console.log('getSingleTargetTrackerArea Successssssssssss', response, this.props);
                const latlng = JSON.parse(this.props.SingleTargetTrackerArea.TargetArea.coordinates);
                const name = this.props.SingleTargetTrackerArea.TargetArea.name;
                const radius = this.props.SingleTargetTrackerArea.TargetArea.radius;
                const startTime = this.props.SingleTargetTrackerArea.TargetArea.startTime;
                const endTime = this.props.SingleTargetTrackerArea.TargetArea.endTime;
                let days = JSON.parse(this.props.SingleTargetTrackerArea.TargetArea.days);

                if (days.length > 0) {
                    for (let i = 0; i < days.length; i++) {
                        { this.state.days[i].value = days[i] }
                    }
                    this.state.markers["0"].position.lat = latlng[0];
                    this.state.markers["0"].position.lng = latlng[1];
                    this.setState({ isSetMapCircle: true, radius: radius });
                }

                this.props.initialize({
                    name: name != null ? name : '0',
                    radius: radius != null ? radius : '0',
                    startTime: startTime != null ? startTime : '00:00:00',
                    endTime: endTime != null ? endTime : '00:00:00',
                });
            }
        ).catch(
            error => {
                console.log('----- onSubmit/ catch.error =====>>>>', error, error.response);
                if (Object.prototype.hasOwnProperty.call(error.response, 'status')) {
                }
            });
    }

    handleSubmit(value) {
        if (this.state.markers[0].position.lat === 23.750259800750143 && this.state.markers[0].position.lng === 90.40973424911499){
            alert('Please Select Map Position.');

            this.setState({isSetMapCircle: false});

        }else {
            const sliced = [];

            for (let i = 0; i < this.state.days.length; i++) {
                sliced.push(this.state.days[i].value);
            }

            const json_area = {
                "areaTypeId": "1",
                "name": `${value.name}`,
                "coordinates": `[${this.state.markers["0"].position.lat},${this.state.markers["0"].position.lng}]`,
                "radius": `${value.radius}`,
                "days": `[${sliced}]`,
                "startTime": `${value.startTime}`,
                "endTime": `${value.endTime}`
            };

            const tracker_id = this.props.match.params.id;
            const zone_id = this.props.match.params.zone;
            const request = this.props.updateTrackerArea(json_area, tracker_id, zone_id);

            request.then(result => {
                if (window.confirm('Success!')){
                    this.setState({isRedirect: true});
                }
            }).catch(error => {
                alert('Error Occured', error);
            });

            //this.setState({ isLoadTracker: true });
            //console.log('handleSubmit', value, json_area);
        }

    }

    onTimeChange(time) {
        this.setState({time});
    }

    onMarkerDragEnd (coord, index) {
        const { latLng } = coord;
        const lat = latLng.lat();
        const lng = latLng.lng();
        console.log('dskj', latLng, lat, lng, ...this.state.markers);

        this.setState(prevState => {
            const markers = [...this.state.markers];
            markers[index] = { ...markers[index], position: { lat, lng } };
            //console.log('markers', markers);
            return { markers };
        });
    };

    onRadiusFieldChange(value) {
        this.setState({radius: value.target.value, isSetMapCircle: false});
    }

    toggleChange(e) {
        //console.log(e);
        const { days } = this.state;
        days[e].value = !this.state.days[e].value;
        this.setState({
            days,
        });
    }

    setTargeteCircle(radius){

        if (this.state.radius > 1){
            //.log("setTargeteCircle", radius);
            this.setState({
                isSetMapCircle: true
            })
        }else {
            alert('Please Enter Radius Value!');
        }

    }

    renderCheckBoxFields() {
        //console.log('renderCheckBoxFields', this.state.days);
        return _.map(this.state.days, field =>
            <div key={field.id} className="col-md-1 ml-2 pl-1 pr-0 d-flex align-items-center">
                <Field
                    name={field.name}
                    className="form-control"
                    component="input"
                    type="checkbox"
                    checked={field.value}
                    onClick={() => this.toggleChange(field.id)}
                    valuefield={field.name}
                    textfield={field.name}
                />
                <label htmlFor={field.name} className="col-form-label">{ field.name }</label>
            </div>);
    }

    render() {
        //console.log('EditTrackerZone  ==== ', this.state.markers, this.state.days);
        //const { handleSubmit } = props;
        if (this.state.isRedirect) {
            return (<Redirect to={`/target-zone/${this.props.match.params.id}`} />);
        }
        //   const classes = useStyles();
        const { handleSubmit, pristine, reset, submitting } = this.props;
        return (
            <div id="wrapper" className="toggled">
                <SidebarView selected="/configure-tracker" />
                <div id="page-content-wrapper " className="">
                    <NavBar />
                    <div className="container-fluid">
                        <h1>TrackerConfiguration</h1>
                        <div className="offset-md-1 col-md-10">
                            <div className="card">
                                {/*<div className="card-header">*/}
                                {/*Edit Tracker Configuration*/}
                                {/*</div>*/}
                                <div className="card-header d-flex justify-content-between">
                                    <span>Create Target Zone</span>
                                    {/*<span>Tracker Id:TR0125R</span>*/}
                                </div>
                                <div className="card-body col-md-10 offset-md-1">
                                    <form className="form-group" onSubmit={handleSubmit(this.handleSubmit)}>

                                        <div className="form-group row">
                                            <label htmlFor="name" className="col-md-3 col-form-label">Zone Name</label>
                                            <div className="col-md-9">
                                                <Field
                                                    name="name"
                                                    className="form-control"
                                                    component={renderField}
                                                    validate={[ maxLength30, minLength5]}
                                                    type="text"
                                                    placeholder="Enter Zone Name"
                                                    onChange={this.onNameFieldChange}
                                                />
                                            </div>
                                        </div>

                                        <div className="form-group row">
                                            <label htmlFor="radius" className="col-md-3 col-form-label">Radius</label>
                                            <div className="col-md-9">
                                                <Field
                                                    name="radius"
                                                    className="form-control"
                                                    component={renderField}
                                                    validate={[ number, maxNumberLength5, minNumberLength2]}
                                                    type="number"
                                                    placeholder="Enter Radius - In Meter"
                                                    onChange={this.onRadiusFieldChange}
                                                />
                                            </div>
                                        </div>

                                        <div className="form-group row">
                                            <label htmlFor="days" className="col-md-3 col-form-label">Day</label>
                                            { <this.renderCheckBoxFields /> }
                                        </div>

                                        <div className="form-group row">
                                            <label htmlFor="startTime" className="col-md-3 col-form-label">Start Time</label>
                                            <div className="col-md-9">
                                                <Field
                                                    name="startTime"
                                                    className="form-control"
                                                    component={renderField}
                                                    validate={required}
                                                    onChange={this.onTimeChange}
                                                    type="time"
                                                />
                                            </div>
                                        </div>

                                        <div className="form-group row">
                                            <label htmlFor="endTime" className="col-md-3 col-form-label">End Time</label>
                                            <div className="col-md-9">
                                                <Field
                                                    name="endTime"
                                                    className="form-control"
                                                    component={renderField}
                                                    validate={required}
                                                    type="time"
                                                />
                                            </div>
                                        </div>



                                        { this.state.isSetMapCircle !== true &&
                                        <div className="form-group row d-flex justify-content-end pr-3">
                                            {/*<label htmlFor="endTime" className="col-md-3 col-form-label">Set Targeted Zone</label>*/}
                                            <div>
                                        <span className="btn btn-info" onClick={() => this.setTargeteCircle(this.state.radius)}
                                              data-toggle="modal">Set Targeted Location
                                        </span>
                                            </div>
                                        </div>
                                        }
                                        <div className="form-group row">
                                            { (this.state.isSetMapCircle && this.state.radius > 0) && <SetMapCircle radius={this.state.radius} onMarkerDragEnd={this.onMarkerDragEnd} markers={this.state.markers} /> }
                                        </div>
                                        {/*<div className="clearFix" />*/}
                                        <div className="row d-flex justify-content-between">
                                            <a href={`#/target-zone/${this.props.match.params.id}`} className="col-md-2 btn btn-primary">Back</a>
                                            <button className="btn btn-primary" type="submit">Save Changes</button>
                                        </div>

                                    </form>
                                </div>
                                <div className="card-footer card-footer-custom">
                                    <div className="col-md-10 offset-md-1 pl-0 pr-0">
                                        <div className="row d-flex justify-content-between">
                                            <a href={`#/target-zone/${this.props.match.params.id}`} className="col-md-4 btn btn-success btn-lg"><small>View Target Zone List</small></a>
                                            <a href={`#/danger-zone/${this.props.match.params.id}`} className="col-md-4 btn btn-danger btn-lg"><small>View Danger Zone List</small></a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

function mapStateToProps(state) {
  //console.log('EditTrackerConfiguration promotion === ', state);
  return {
    SingleTargetTrackerArea: state.tracker
  };
}

function validate(values) {
    //console.log('inside validate === ', values);
    const errors = {};
    if (!values.name) { errors.name = 'Enter Zone Name'; }
    if (!values.radius) { errors.radius = 'Enter Radius - In Meter'; }

    return errors;
}

EditTargetZone = reduxForm({
    // a unique name for the form
    form: 'editTrackerForm',
    enableReinitialize: false,
    Field,
    validate,
})(EditTargetZone);

export default connect(mapStateToProps, { getSingleTargetTrackerArea, updateTrackerArea })(EditTargetZone);


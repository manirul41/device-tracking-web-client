import React, { Component } from 'react';
import { Field, reduxForm, reset } from 'redux-form';
import { renderField } from '../../reduxFormHelper/renderField';
import SetMapCircle from "./SetMapCircle";
import NavBar from "../../common/NavBar";
import SidebarView from "../../common/SidebarView";
import {setTrackerArea} from '../../../actions/tracker';
import {connect} from "react-redux";
import Modal from "react-bootstrap/Modal";
import ErrorMessage from "../../common/errors/ErrorMessage";

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

/*this createTrackerZone function used for Creating new target area of a tracker*/

let CreateError = '';
let CreateSuccess = '';

class CreateDangerTrackerZone extends Component {
    constructor(props) {
        super(props);
        this.state = {
            activePage: 1,
            isChecked: true,
            isSetMapCircle: false,
            radius: 0,
            time: '00:00:00',
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
            ],
            show: true,
            isCreateError: false,
            isSuccessCreate: false,

        };
        this.handleSubmit = this.handleSubmit.bind(this);
        this.renderCheckBoxFields = this.renderCheckBoxFields.bind(this);
        this.onRadiusFieldChange = this.onRadiusFieldChange.bind(this);
        this.setTargeteCircle = this.setTargeteCircle.bind(this);
        this.onMarkerDragEnd = this.onMarkerDragEnd.bind(this);
        this.toggleChange = this.toggleChange.bind(this);
        this.onTimeChange = this.onTimeChange.bind(this);
        this.handleCreateError = this.handleCreateError.bind(this);
        this.handleClose = this.handleClose.bind(this);
    }

    handleClose() {
        this.setState({
            show: true,
            isSuccessCreate: false,
            isRedirect: true
        });
    }

    handleCreateError() {
        this.setState({
            isCreateError: !this.state.isCreateError,
        })
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
                "areaTypeId": "2",
                "name": `${value.name}`,
                "coordinates": `[${this.state.markers["0"].position.lat},${this.state.markers["0"].position.lng}]`,
                "radius": `${value.radius}`,
                "days": `[${sliced}]`,
                "startTime": `${value.startTime}`,
                "endTime": `${value.endTime}`
            };

            const tracker_id = this.props.match.params.id;
            const request = this.props.setTrackerArea(json_area, tracker_id);

            request.then(response => {
                CreateSuccess = response.payload.data.message;
                this.setState({
                    isSuccessCreate: true,
                    //isRedirect: true
                })
            }).catch(error => {
                if (error.response.data.errors.length > 0 ){
                    // CreateError = error.response.data.errors[0].msg;
                    CreateError = `${error.response.data.message +" "+ error.response.data.errors[0].msg}`;
                    this.setState({
                        isCreateError: true,
                    });
                }

                //alert('Error Occured', error);
            });

            //this.setState({ isLoadTracker: true });
            //console.log('handleSubmit', value, this.state.markers, this.state.days, tracker_id);
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
            console.log('markers', markers);
            return { markers };
        });
    };

    onRadiusFieldChange(value) {
        this.setState({radius: value.target.value, isSetMapCircle: false});
    }

    toggleChange(e) {
        console.log(e);
        const { days } = this.state;
        days[e].value = !this.state.days[e].value;
        this.setState({
            days,
        });
    }

    setTargeteCircle(radius){

        if (this.state.radius > 1){
            console.log("setTargeteCircle", radius);
            this.setState({
                isSetMapCircle: true
            })
        }else {
            alert('Please Enter Radius Value!');
        }

    }

    renderCheckBoxFields() {
        return _.map(this.state.days, field =>
            <div key={field.id} className="col-md-1 ml-2 pl-1 pr-0 d-flex align-items-center">
                <Field
                    name={field.name}
                    className="form-control"
                    component="input"
                    type="checkbox"
                    checked={this.state.days[field.value]}
                    onClick={() => this.toggleChange(field.id)}
                    valuefield={field.name}
                    textfield={field.name}
                />
                <label htmlFor={field.name} className="col-form-label">{ field.name }</label>
            </div>);
    }

  render() {
    console.log('EditTrackerConfiguration  ==== ', this.state.markers, this.state.radius);
    //const { handleSubmit } = props;
    // if (!this.props.perPageRows) {
    //   return <span>Loading...</span>;
    // }
    //   const classes = useStyles();
    const { handleSubmit, pristine, reset, submitting } = this.props;
    return (
        <div id="wrapper" className="toggled">
            <SidebarView selected="/configure-tracker" />
            <div id="page-content-wrapper " className="">
                <NavBar />
                <div className="container-fluid">
                    {this.state.isSuccessCreate &&
                    <Modal className="mt-5" show={this.state.show} onHide={this.handleClose}>
                        <Modal.Body className="p-5">
                            {/*<h1>{userCreateSuccess}</h1>*/}
                            <div className="d-flex flex-column align-items-center">
                                <label>{CreateSuccess}</label>
                                <div className="d-flex flex-row align-items-center">
                                    <i className="far fa-check-circle fa-5x"/>
                                </div>
                            </div>
                            <div className="d-flex flex-column align-items-end">
                                <span className="col-md-2 btn btn-sm btn-info" onClick={this.handleClose}>Ok</span>
                            </div>
                        </Modal.Body>
                    </Modal>}
                    <h1>TrackerConfiguration</h1>
                    <div className="offset-md-1 col-md-10">
                        <div className="card">
                            {/*<div className="card-header">*/}
                            {/*Edit Tracker Configuration*/}
                            {/*</div>*/}
                            <div className="card-header d-flex justify-content-between">
                                <span>Create Danger Zone</span>
                                {/*<span>Tracker Id:TR0125R</span>*/}
                            </div>
                            <div className="card-body col-md-10 offset-md-1">
                                <ErrorMessage CreateError={CreateError} isCreateError={this.state.isCreateError}
                                              handleCreateError={this.handleCreateError}/>
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
                                              data-toggle="modal">Set Danger Location
                                        </span>
                                        </div>
                                    </div>
                                    }
                                    <div className="form-group row">
                                        { (this.state.isSetMapCircle && this.state.radius > 0) && <SetMapCircle radius={this.state.radius} onMarkerDragEnd={this.onMarkerDragEnd} markers={this.state.markers} /> }
                                    </div>
                                    {/*<div className="clearFix" />*/}
                                    <div className="row d-flex justify-content-between">
                                        <a href={`#/danger-zone/${this.props.match.params.id}`} className="col-md-2 btn btn-primary">Back</a>
                                        <button className="btn btn-primary mapSetButton" type="submit">Save Changes</button>
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

// function mapStateToProps(state) {
//   console.log('EditTrackerConfiguration promotion === ', promotion);
//   return {
//     totalRowNo: _.isEmpty(promotion) ? 0 : promotion.totalRowNo,
//     perPageRows: _.isEmpty(promotion) ? [] : promotion.perPageRows
//   };
// }

function validate(values) {
    //console.log('inside validate === ', values);
    const errors = {};
    if (!values.name) { errors.name = 'Enter Zone Name'; }
    if (!values.radius) { errors.radius = 'Enter Radius - In Meter'; }

    return errors;
}

CreateDangerTrackerZone = reduxForm({
    // a unique name for the form
    form: 'createDangerTrackerForm',
    enableReinitialize: false,
    Field,
    validate,
})(CreateDangerTrackerZone);


export default connect(null, { setTrackerArea })(CreateDangerTrackerZone);


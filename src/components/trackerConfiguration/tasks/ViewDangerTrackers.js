import React, { Component } from 'react';
import NavBar from "../../common/NavBar";
import SidebarView from "../../common/SidebarView";
import ReactLoading from "react-loading";
import {Redirect} from "react-router";
import {connect} from "react-redux";
import {deleteSingleTargetTrackerArea, getSingleDangerTrackerAreas} from "../../../actions/tracker";

class ViewDangerTrackers extends Component {
    constructor(props) {
        super(props);
        this.state = {
            activePage: 1,
            isViewTracker: true,
            isReload: false
        };
        this.createDangerZone = this.createDangerZone.bind(this);
        this.veiwDangerTracker = this.veiwDangerTracker.bind(this);
        this.deleteDangerTrackerArea = this.deleteDangerTrackerArea.bind(this);
        this.renderPerPageRows = this.renderPerPageRows.bind(this);
    }

    componentDidMount() {
        //console.log('getSingleTargetTrackerAreas');
        this.props.getSingleDangerTrackerAreas(this.props.match.params.id);
    }

  createDangerZone() {
      //e.preventDefault();
      console.log('createDangerZone',);
      this.setState({isViewTracker: false});
  }
  veiwDangerTracker() {
      //e.preventDefault();
      console.log('viewTracker');
      this.setState({isViewTracker: true});
  }

    deleteDangerTrackerArea(tracker_id, zone_id) {
        //e.preventDefault();
        console.log('deleteTrackerArea', tracker_id,zone_id);
        let btn_response = confirm("Are you sure?");
        if (btn_response === true) {
            const request = this.props.deleteSingleTargetTrackerArea(tracker_id,zone_id);
            request.then(
                response => {
                    alert('Successfully Deleted!');
                    this.setState({isReload: true});
                }
            ).catch(
                error => {
                    console.log('----- onSubmit/ catch.error =====>>>>', error, error.response);
                    if (Object.prototype.hasOwnProperty.call(error.response, 'status')) {
                    }
                });
        } else {
            console.log('You pressed Cancel!');
        }
    }

    renderPerPageRows() {
        //console.log('renderPerPageRows', this.props.singleTargetTrackerAreas);
        const dangerAreas = this.props.singleDangerTrackerAreas.DangerAreas.rows;
        return _.map(dangerAreas, row => {
            if (row.areaTypeId === 2){
                return (
                    <tr key={row.id}>
                        <th> { row.name } </th>
                        <td>
                            <div className="d-flex justify-content-center">
                                <a href={`#/danger-zone/${row.trackerId}/edit-zone/${row.id}`} className="col-md-3 btn btn-primary mr-1">Edit</a>
                                <span onClick={() => this.deleteDangerTrackerArea(row.trackerId, row.id)} className="col-md-3 btn btn-danger">Delete</span>
                            </div>
                        </td>
                    </tr>
                );
            }
        });
    }

  render() {
    console.log('ViewDanger Trackers  ==== ');
    if (this.props.singleDangerTrackerAreas === null) {
        return <ReactLoading className='relaod-logo-css' type="spinningBubbles" color="#aaaaaa" height={50} width={50} />;
    }
    if (this.state.isReload) {
        return (<Redirect to={`${this.props.match.url}`} />);
    }
    return (
        <div id="wrapper" className="toggled">
            <SidebarView selected="/configure-tracker" />
            <div id="page-content-wrapper " className="">
                <NavBar />
                <div className="container-fluid">
                    <h1>Danger Tracker Configuration</h1>
                    { this.state.isViewTracker &&
                    <div className="offset-md-1 col-md-10">
                        <div className="card">
                            <div className="card-header d-flex justify-content-between">
                                <span>Tracker Danger Zones</span>
                                {/*<span>Tracker Id:TR0125R</span>*/}
                            </div>
                            <div className="card-body">
                                <div className="pb-1">
                                    <a href={`#/danger-zone/${this.props.match.params.id}/create-zone`} className="col-md-2 btn btn-secondary"><i className="fa fa-plus" /> <small>CREATE AREA</small></a>
                                </div>
                                <div className="table-responsive">
                                    <table className="table text-center">
                                        <thead className="bg-primary text-white">
                                            <tr>
                                                <th scope="col">Zone Name</th>
                                                <th scope="col">Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                        { this.renderPerPageRows() }
                                        </tbody>
                                    </table>
                                    <hr />
                                </div>
                            </div>
                        </div>
                    </div>
                    }
                    {/*{this.state.isViewTracker === false && <CreateDangerTrackerZone veiwDangerTracker={this.veiwDangerTracker} />}*/}
                </div>
            </div>
        </div>
    );
  }
}

function mapStateToProps(state) {
    //console.log('ViewTargetTrackers promotion === ', state);
    return {
        //singleTargetTrackerAreas: state.trackerArea
        singleDangerTrackerAreas: state.DangerTrackerArea
    };
}

export default connect(mapStateToProps, { getSingleDangerTrackerAreas, deleteSingleTargetTrackerArea })(ViewDangerTrackers);


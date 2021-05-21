import React, { Component } from 'react';
import ReactLoading from 'react-loading';
import NavBar from "../../common/NavBar";
import SidebarView from "../../common/SidebarView";
import {getSingleTargetTrackerAreas, deleteSingleTargetTrackerArea} from '../../../actions/tracker';
import {connect} from "react-redux";
import setAuthorizationData from "../../../utils/setAuthorizationData";
import {Redirect} from "react-router";

class ViewTargetTrackers extends Component {
    constructor(props) {
        super(props);
        this.state = {
            activePage: 1,
            isViewTracker: true,
            isReload: false
        };
        this.createTargetZone = this.createTargetZone.bind(this);
        this.viewTracker = this.viewTracker.bind(this);
        this.deleteTrackerArea = this.deleteTrackerArea.bind(this);
        this.renderPerPageRows = this.renderPerPageRows.bind(this);
    }

    componentDidMount() {
        //console.log('getSingleTargetTrackerAreas');
        this.props.getSingleTargetTrackerAreas(this.props.match.params.id);
    }

    createTargetZone() {
        //e.preventDefault();
        //console.log('createTargetZone',);
        this.setState({isViewTracker: false});
    }

    viewTracker() {
        //e.preventDefault();
        //console.log('viewTracker');
        this.setState({isViewTracker: true});
    }

    deleteTrackerArea(tracker_id, zone_id) {
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
      const targetAreas = this.props.singleTargetTrackerAreas.TargetAreas.rows;
      return _.map(targetAreas, row => {
          if (row.areaTypeId === 1){
              return (
                  <tr key={row.id}>
                      <th> { row.name } </th>
                      <td>
                          <div className="d-flex justify-content-center">
                              <a href={`#/target-zone/${row.trackerId}/edit-zone/${row.id}`} className="col-md-3 btn btn-primary mr-1">Edit</a>
                              <span onClick={() => this.deleteTrackerArea(row.trackerId, row.id)} className="col-md-3 btn btn-danger">Delete</span>
                          </div>
                      </td>
                  </tr>
              );
          }
      });
    }

    render() {
        //console.log('ViewTracker  ==== ',this.props.singleTargetTrackerAreas);
        if (this.props.singleTargetTrackerAreas === null) {
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
                        <h1>Target Tracker Configuration</h1>
                        { this.state.isViewTracker &&
                        <div className="offset-md-1 col-md-10">
                            <div className="card">
                                <div className="card-header d-flex justify-content-between">
                                    <span>Tracker Target Zones</span>
                                    {/*<span>Tracker Id:TR0125R</span>*/}
                                </div>
                                <div className="card-body">
                                    <div className="pb-1">
                                        <a href={`#/target-zone/${this.props.match.params.id}/create-zone`} className="col-md-2 btn btn-secondary"><i className="fa fa-plus" /> <small>CREATE AREA</small></a>
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
                                            {/*<tr>*/}
                                                {/*<th scope="row"> School</th>*/}
                                                {/*<td> DONE </td>*/}
                                                {/*<td className="d-flex justify-content-around">*/}
                                                    {/*<span className="col-md-5 btn btn-info">Edit</span>*/}
                                                    {/*<span className="col-md-5 btn btn-danger">Delete</span>*/}
                                                {/*</td>*/}
                                            {/*</tr>*/}
                                            {/*<tr>*/}
                                                {/*<th scope="row"> Coaching </th>*/}
                                                {/*<td> PENDING </td>*/}
                                                {/*<td className="d-flex justify-content-around">*/}
                                                    {/*<span className="col-md-5 btn btn-warning">Configure</span>*/}
                                                    {/*<span className="col-md-5 btn btn-danger">Delete</span>*/}
                                                {/*</td>*/}
                                            {/*</tr>*/}
                                            </tbody>
                                        </table>
                                        <hr />
                                    </div>
                                </div>
                            </div>
                        </div>
                        }
                        {/*{this.state.isViewTracker === false && <CreateTrackerZone viewTracker={this.viewTracker} />}*/}
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
      singleTargetTrackerAreas: state.trackerArea
  };
}

// function mapStateToProps(state) {
//   console.log('ViewTrackers promotion === ', promotion);
//   return {
//     totalRowNo: _.isEmpty(promotion) ? 0 : promotion.totalRowNo,
//     perPageRows: _.isEmpty(promotion) ? [] : promotion.perPageRows
//   };
// }

export default connect(mapStateToProps, { getSingleTargetTrackerAreas, deleteSingleTargetTrackerArea })(ViewTargetTrackers);

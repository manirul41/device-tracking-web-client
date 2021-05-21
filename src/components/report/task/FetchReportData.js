import React, { Component } from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import ReactLoading from 'react-loading';
import GeoLocation from './GeoLocation';
import { getTrackersReport } from '../../../actions/tracker';
import {isEmpty} from "lodash";
import Pagination from "react-bootstrap/Pagination";
import {CSVLink} from "react-csv";

let filteredData = [];
let dataUserInit = [];

let page_per_content = 100;

class FetchReportData extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dataUser: [],
            isLoadData: '',
            active: 1,
        };
        this.handleDownloadRowData = this.handleDownloadRowData.bind(this)
        this.renderPerPageRows = this.renderPerPageRows.bind(this)
        this.onChangePage = this.onChangePage.bind(this)
        this.paginationBasic = this.paginationBasic.bind(this)
    }


    componentDidMount() {
        this.props.getTrackersReport(this.props.id,
            this.props.startDate,
            this.props.endDate).then(
            response => {
                //console.log('user data parsing////', response.payload.data.data.rows);
                let resData = response.payload.data.data.rows;
                dataUserInit = resData;
                filteredData = resData;
                this.setState({
                    dataUser: resData
                });
                //console.log(resData);

            }
        ).catch(
            (e) => {
                console.log("Opps! undefined error", e);
            }
        );
      }

    onChangePage(value) {
        this.setState({
            active: value
        })
    }

    paginationBasic() {

        let items = [];
        let pagination_length = Math.ceil(filteredData.length / page_per_content);

        for (let number = 1; number <= pagination_length; number++) {
            items.push(
                <Pagination.Item key={number} onClick={() => this.onChangePage(number)}
                                 active={number === this.state.active}>
                    {number}
                </Pagination.Item>,
            );
        }
        return <Pagination size="sm">{items}</Pagination>;
    }
    
      componentDidUpdate(prevProps) {
        if (
          this.props.id !== prevProps.id ||
          this.props.startDate !== prevProps.startDate ||
          this.props.endDate !== prevProps.endDate) {
            this.props.getTrackersReport(this.props.id,
                this.props.startDate,
                this.props.endDate).then(
                response => {
                    //console.log('user data parsing////', response.payload.data.data.rows);
                    let resData = response.payload.data.data.rows;
                    dataUserInit = resData;
                    filteredData = resData;
                    this.setState({
                        dataUser: resData
                    });
                    //console.log(resData);

                }
            ).catch(
                (e) => {
                    console.log("Opps! undefined error", e);
                }
            );
        }
      }

    checkNullLocation(value, value2) {
        if (isEmpty(value2) === false && JSON.parse(value2).length === 2) {
            //console.log("value, value2", value, JSON.parse(value2).length)
            const result = JSON.parse(value2);
            if (value !== null) {
                return (
                    <div>
                        <div>
                            <strong>{value.name}</strong>
                        </div>
                        <div>
                            ({result[0]}, {result[1]})
                            <a href={`https://www.google.com/maps/search/?api=1&query=${result}`} target="_blank"> See On Map</a>
                        </div>
                    </div>
                );
            }
            return (
                <div>
                    ({result[0]}, {result[1]})
                    <a href={`https://www.google.com/maps/search/?api=1&query=${result}`} target="_blank"> See On Map</a>
                </div>);
        }else {
            return "Null";
        }
    }
      
      checkAreaType(value) {
        if (value === null) { return <div>Normal</div>; }
        return <div><strong>{value.areaType.type}</strong></div>;
    }
      checkPositionStatus(value) {
        if (value === null) { return <div>-</div>; }
        return <div>{value.status}</div>;
    }
      // checkNmae(id) {
      //   if (Array.isArray(this.props.name)) {
      //     for (let i = 0; i <= this.props.name.length; i++) {
      //       if (this.props.name[0][i].value === id) {
      //         return <div>{this.props.name[0][i].label}</div>;
      //       }
      //     }
      //   }
      //   return <div>{this.props.name}</div>;
      // }
    
      checkNullDuration(value) {
        if (value === null || value === 0) {
          return <span>-</span>;
        }
        const result = moment
          .duration(value, 'minutes')
          .format('d[d] h[h] m[m] s[s]', { trim: 'all' });
        return <span>{result}</span>;
      }


    renderPerPageRows() {
        let ordered_list = _.orderBy(filteredData, ['date'], ['desc']);
        let list = ordered_list.slice((this.state.active - 1) * page_per_content, this.state.active * page_per_content);
        //console.log(filteredData);
        return _.map(list, row => {
            return (
                <tr key={row.id}>
                    <td>{row.trackerId}</td>
                    <td style={{width: 50}}>
                        {this.checkNullLocation(
                            row.trackerArea,
                            row.coordinates
                        )}
                    </td>
                    <td>{ this.checkNullDuration(row.duration) }</td>
                    <td>{ this.checkNullDuration(row.time) }</td>
                    <td>{ this.checkAreaType(row.trackerArea) }</td>
                    <td>{ this.checkPositionStatus(row.positionStatus) }</td>
                </tr>
            );
        });
    }

    handleDownloadRowData(){
        const sliced = [];
        for (let i = 0; i < filteredData.length; i++) {
            sliced.push({
                id: filteredData[i].id,
                trackerId: filteredData[i].trackerId,
                coordinateSavedArea: `${filteredData[i].trackerArea !== null ? filteredData[i].trackerArea.name : "-" }`,
                onMapLink: `${filteredData[i].coordinates !== null ? `https://www.google.com/maps/search/?api=1&query=${JSON.parse(filteredData[i].coordinates)}` : "Null" }`,
                stayTime: `${filteredData[i].duration !== null ? moment.duration(filteredData[i].duration, 'minutes').format('d[d] h[h] m[m] s[s]', { trim: 'all' }) : "-" }`,
                deviceTime: `${filteredData[i].time !== null ? moment.duration(filteredData[i].time, 'minutes').format('d[d] h[h] m[m] s[s]', { trim: 'all' }) : "-" }`,
                zoneType: `${filteredData[i].trackerArea !== null ? filteredData[i].trackerArea.areaType.type : "Normal" }`,
                healthStatus: `${filteredData[i].positionStatus !== null ? filteredData[i].positionStatus.status : "-" }`,
            });
        }
        return sliced;
        //console.log("sliced", sliced)
    }
    
    //   createTable() {
    //     const sliced = [];
    //
    //    if (this.props.reportData.TrackerReport !== null) {
    //     this.props.reportData.TrackerReport.rows.map((tracker, index) => {
    //         sliced.push(<tr key={index}>
    //             <th>{tracker.trackerId}</th>
    //             <td style={{ width: 50 }}>
    //                 {this.checkNullLocation(tracker.trackerArea, tracker.coordinates)}
    //             </td>
    //             <td>{ this.checkNullDuration(tracker.duration) }</td>
    //             <td>{ this.checkNullDuration(tracker.time) }</td>
    //             <td>{ this.checkAreaType(tracker.trackerArea) }</td>
    //             <td>{ this.checkPositionStatus(tracker.positionStatus) }</td>
    //         </tr>);
    //     });
    //     return sliced;
    //    }
    // }
    
    render() {
        if (this.state.dataUser.length === 0) {
            return (<ReactLoading
                className='relaod-logo-css' type="spinningBubbles" color="#aaaaaa" height={50}
                    width={50}
            />);
          }
        return ( 
            <div>
                <div className="d-flex flex-row justify-content-end">
                    {this.state.dataUser.length > 0 && <CSVLink
                        data={this.handleDownloadRowData()}
                        filename={"my-file.csv"}
                        className="btn btn-outline-success"
                        target="_blank"
                    >
                        Download
                        <i className="fas fa-cloud-download-alt ml-2"/>
                    </CSVLink>}
                </div>
            <div className="row mt-2">
                {/*{this.state.dataUser.length > 0 && this.handleDownloadRowData()}*/}
                <table id="capture" className="table table-responsive-md table-hover">
                    <thead className="bg-primary text-white">
                        <tr>
                        <th style={{ width: 20 }}><div>Tracker Id</div></th>
                        <th style={{ width: 20 }}><div>Co-ordinate(On Map)</div></th>
                        <th style={{ width: 20 }}><div>Stay Time</div></th>
                        <th style={{ width: 20 }}>Device Time</th>
                        <th style={{ width: 20 }}>Zone Type</th>
                        <th style={{ width: 20 }}>Health Status</th>
                        </tr>
                    </thead>
                <tbody>
                    {this.state.dataUser.length > 0 && this.renderPerPageRows()}
                </tbody>
                </table>
            </div>
                <div className="d-flex flex-wrap">
                    {this.state.dataUser.length > 0 && this.paginationBasic()}
                </div>
          </div>
        );
    }
}

// function mapStateToProps(state) {
//     //console.log('mapstatetoprops.....TrackerReport....', state.report);
//     return {
//       reportData: state.report
//     };
//   }
 
  export default connect(null, { getTrackersReport })(FetchReportData);

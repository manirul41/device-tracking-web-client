import React, {Component} from 'react';
import {connect} from 'react-redux';
import Moment from 'react-moment';
import moment from 'moment';
import {getTrackersHistory} from '../../actions/tracker';
import ReactLoading from "react-loading";
import {isEmpty} from "lodash";
import Pagination from "react-bootstrap/Pagination";

let filteredData = [];
let dataUserInit = [];

let page_per_content = 100;

class FetchHistoryData extends Component {
    constructor(props) {
        super(props);
        this.state = {
            rowLength: 0,
            activePage: 1,
            dataUser: [],
            isLoadData: '',
            active: 1,
        };
        this.renderPerPageRows = this.renderPerPageRows.bind(this)
        this.onChangePage = this.onChangePage.bind(this)
        this.paginationBasic = this.paginationBasic.bind(this)
    }


    componentDidMount() {
        this.props.getTrackersHistory(this.props.id,
            this.props.startDate,
            this.props.endDate).then(
            response => {
                console.log('user data parsing////', response.payload.data.data.rows);
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
        //console.log("Opps! undefined this.props", this.props.endDate, prevProps.endDate);
        if (
            this.props.id !== prevProps.id ||
            this.props.startDate !== prevProps.startDate ||
            this.props.endDate !== prevProps.endDate) {
            this.props.getTrackersHistory(this.props.id,
                this.props.startDate,
                this.props.endDate).then(
                response => {
                    console.log('user data parsing////', response.payload.data.data.rows);
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
            const result = JSON.parse(value2);
            if (value !== null) {
                return (
                    <div>
                        <div>
                            <strong>{value.name}</strong>
                        </div>
                        <div>
                            ({result[0]}, {result[1]})
                            <a href={`https://www.google.com/maps/search/?api=1&query=${result}`} target="_blank"> See
                                On Map</a>
                        </div>
                    </div>
                );
            }
            return (
                <div>
                    ({result[0]}, {result[1]})
                    <a href={`https://www.google.com/maps/search/?api=1&query=${result}`} target="_blank"> See On
                        Map</a>
                </div>);
        } else {
            return "Null";
        }
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
            .format('d[d] h[h] m[m] s[s]', {trim: 'all'});
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
                    <td>
                        <div>
                            <Moment format="MMMM DD,YYYY">
                                {row.date}
                            </Moment>
                        </div>
                        <div>{moment(row.date).utcOffset(row.date).format("h:mm:ss a")}</div>
                    </td>
                    <td>
                        {this.checkNullDuration(row.duration)}
                    </td>
                </tr>
            );
        });
    }

    render() {
        if (this.state.dataUser.length === 0) {
            return <ReactLoading className='relaod-logo-css' type="spinningBubbles" color="#aaaaaa" height={50}
                                 width={50}/>;
        }
        return (
            <div>
                <div className="row mt-2">
                    <table className="table table-responsive-md table-hover">
                        <thead className="bg-primary text-white">
                        <tr>
                            <th style={{width: 20}}>
                                <div>Tracker Id</div>
                            </th>
                            <th style={{width: 20}}>
                                <div>Location (Lat-Long)</div>
                            </th>
                            <th style={{width: 20}}>
                                <div>Date Time</div>
                            </th>
                            <th style={{width: 20}}>Duration</th>
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

function mapStateToProps(state) {
    return {
        historyData: state.history
    };
}

export default connect(
    mapStateToProps,
    {getTrackersHistory}
)(FetchHistoryData);

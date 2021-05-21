import React, { Component } from 'react';
import { Map, GoogleApiWrapper, Marker, Polygon, InfoWindow } from 'google-maps-react';
import { connect } from 'react-redux';
import moment from 'moment';
import { getTrackersPosition ,getUserTrackersLatestPosition, getUserSingleTrackerLatestPosition, getTrackerPosition } from '../../actions/tracker';
import ReactLoading from 'react-loading';
import {LOCAL_STORAGE_DATA_KEYNAME} from "../../actions/types";
import Geocode from "react-geocode";
import {Redirect} from "react-router";

const image_watch_url = "../images/loginpage/custom_marker.png"
const image_watch_url_2 = "../images/loginpage/custom_marker2.png"
const image_watch_url_3 = "../images/loginpage/custom_marker_3.png"

Geocode.setApiKey('AIzaSyAlZStI8_JrKEkE5D4PPn74Q2q6H0zmaow');
Geocode.enableDebug();

const mapStyles = {
    width: '120%',
    height: '100%'
};

let defaultZoom = 11;
const sliced = [];

const initialState = {
    dropdownVisibility: '',
    sliced: [],
    address: '',
    trackerID: null,
    speed: null,
    date: null,
    showingInfoWindow: true,
    activeMarker: {},
    selectedPlace: {},
    isRedirect: false
};

let center = {
    latitude: 23.77,
    longitude: 90.354
};

class SingleTrackerMap extends Component {
    constructor(props) {
        super(props);
        this.state = {
            ...initialState
        };
        this.onMarkerClick = this.onMarkerClick.bind(this);
        this.onMapClick = this.onMapClick.bind(this);
        this.setLocation = this.setLocation.bind(this);
        this.handleRefreshButton = this.handleRefreshButton.bind(this);
    }

    handleRefreshButton(){
        this.setState({
            isRedirect: true
        })
    }

    onMarkerClick(props, marker, e, row) {
        console.log("props, marker, e, ",row);
        const address = JSON.parse(row.coordinates);
        const trackerID = row.trackerId;
        const speed = row.positionStatusId != null ? row.positionStatusId : "Not Available";
        const time = moment(row.updatedAt).format('LLL');
        console.log(address);
        center = {
            latitude: address[0],
            longitude: address[1]
        }
        defaultZoom = 19;
        console.log(center);
        this.setState({
            address: address,
            speed: speed,
            trackerID: trackerID,
            date: time,
            selectedPlace: props,
            activeMarker: marker,
            showingInfoWindow: true
        });
        // Geocode.setApiKey('AIzaSyAlZStI8_JrKEkE5D4PPn74Q2q6H0zmaow');
        // Geocode.enableDebug();
        // Geocode.fromLatLng(JSON.parse(row.coordinates)[0], JSON.parse(row.coordinates)[1]).then(
        //     response => {
        //         //console.log('.........responce', response);
        //         const address = response.results[0].formatted_address;
        //         const trackerID = row.trackerId;
        //         const speed = row.positionStatus != null ? row.positionStatus.status : "Not Available";
        //         const time = moment(row.updatedAt).format('LLL');
        //         console.log(address);
        //         this.setState({
        //             address: address,
        //             speed: speed,
        //             trackerID: trackerID,
        //             date: time,
        //             selectedPlace: props,
        //             activeMarker: marker,
        //             showingInfoWindow: e
        //         });
        //     },
        //     error => {
        //         console.error(error);
        //     }
        // );

        // this.setState({
        //     selectedPlace: props,
        //     activeMarker: marker,
        //     showingInfoWindow: e
        // });
    }

    onMapClick() {
        this.setState({
            showingInfoWindow: !this.state.showingInfoWindow,
            activeMarker: null
        });
    }

    componentDidMount() {
        const userLocalData = JSON.parse(localStorage.getItem(LOCAL_STORAGE_DATA_KEYNAME));
        if (userLocalData != null) {
            this.props.getUserTrackersLatestPosition(userLocalData.user.id)
        }
    }

    componentDidUpdate(prevProps) {
        if (this.props.mapData !== prevProps.mapData) {
            const userLocalData = JSON.parse(localStorage.getItem(LOCAL_STORAGE_DATA_KEYNAME));
            if (userLocalData != null) {
                if (this.props.mapData > 0){
                    this.props.getTrackerPosition(this.props.mapData).then(
                        response => {
                            console.log("success", response.payload.data.data.rows);
                            let trackerData = response.payload.data.data.rows;
                            if (trackerData.length > 0) {
                                for (let i = 0; i < trackerData.length; i++) {
                                    if (trackerData[i].coordinates != null) {
                                        sliced.push({
                                            latitude: trackerData[i].coordinates,
                                            longitude: trackerData[i].coordinates
                                        });
                                    }

                                }
                            }
                        }
                    )
                }else {
                    this.props.getUserTrackersLatestPosition(userLocalData.user.id)
                }
            }
        }
    }

    renderMarkers(points) {
        return points.map((point) => (
            <Marker
                title={`${point.latitude}, ${point.longitude}`}
                key={point.id}
                position={{ lat: parseFloat(point.latitude), lng: parseFloat(point.longitude) }}
            />
        ));
    }

    setLocation(coordinates) {
        Geocode.fromLatLng(JSON.parse(coordinates)[0], JSON.parse(coordinates)[1]).then( res => {
            console.log("setLocation", res);
            let address = res.results[0].formatted_address;
            return JSON.stringify(address);
        });
    }



    render() {
        if (this.state.isRedirect) {
            return (<Redirect to={'/'} />);
        }
        if (this.props.TrackerLatLong === null){
            return <ReactLoading className='relaod-logo-css' type="spinningBubbles" color="#aaaaaa" height={50} width={50} />;
        }
        if (this.props.TrackerLatLong.rows.length <= 0){
            return (
                <div className="d-flex justify-content-center">
                    <h4 className="display-4 mt-5">OPPS! No Data Found From Your Tracker.</h4>
                </div>
            );
        }



        if (this.props.mapData !== 0){
            const perPageRows = this.props.TrackerLatLong.rows;
            for (let i = 0; i < perPageRows.length; i++) {
                if (perPageRows[i].tracker.trackerPosition !== null) {
                    center = {
                        latitude: JSON.parse(perPageRows[i].tracker.trackerPosition.coordinates)[0],
                        longitude: JSON.parse(perPageRows[i].tracker.trackerPosition.coordinates)[1]
                    }
                    defaultZoom = 16
                }
            }
        }else {
            defaultZoom = 14
        }


        // center = {
        //     latitude: center.latitude,
        //     longitude: center.longitude
        // };

        let iconMarker = new window.google.maps.MarkerImage(
            image_watch_url,
            null, /* size is determined at runtime */
            null, /* origin is 0,0 */
            null, /* anchor is bottom center of the scaled image */
            new window.google.maps.Size(190, 80)
        );

        let iconMarker_3 = new window.google.maps.MarkerImage(
            image_watch_url_3,
            null, /* size is determined at runtime */
            null, /* origin is 0,0 */
            null, /* anchor is bottom center of the scaled image */
            null
        );

        let offlineIconMarker = new window.google.maps.MarkerImage(
            image_watch_url_2,
            null, /* size is determined at runtime */
            null, /* origin is 0,0 */
            null, /* anchor is bottom center of the scaled image */
            new window.google.maps.Size(190, 80)
        );
        console.log("defaultZoom+center", this.props.TrackerLatLong)

        return (
            <div className="row " style={{ height: '70vh', width: '100%' }}>
                <div className="lead justify-content-center pl-0  mt-1 pr-1">
                    <div className="d-flex justify-content-left pb-2">
                        <h4>Tracker Current Position</h4>
                        <span onClick={this.handleRefreshButton} className="btn btn-info btn-sm ml-2"><i className="fas fa-sync-alt"/></span>
                    </div>
                    <Map
                        google={this.props.google}
                        zoom={defaultZoom}
                        style={mapStyles}
                        // defaultCenter={
                        //     new google.maps.LatLng(center)
                        // }

                        center={{
                            lat: center.latitude,
                            lng: center.longitude
                        }}
                        initialCenter={{
                            lat: center.latitude,
                            lng: center.longitude
                        }}
                        //onClick={this.onMapClick}
                    >
                        {this.props.mapData === 0 &&
                        this.props.TrackerLatLong.rows.map(row => row.tracker.trackerPosition !== null ? (
                            // console.log(marker.coordinates[0])
                            //JSON.parse(marker.coordinates)
                            <Marker
                                icon={row.tracker.isOnline === true ? iconMarker : offlineIconMarker}
                                //onClick={(props, marker, e) => this.onMarkerClick(props, marker, e, row.tracker.trackerPosition)}
                                name={'Current location'}
                                title={JSON.stringify(row.tracker.trackerPosition.coordinates)}
                                key={row.tracker.trackerPosition.id}
                                label={ `${row.tracker.trackerConfiguration !== null ? row.tracker.trackerConfiguration.givenName : row.tracker.name}` +" "+ `${JSON.stringify(row.tracker.trackerPosition.positionStatus != null ? row.tracker.trackerPosition.positionStatus.status : "N/A")}`+" "+`${row.tracker.trackerPosition !== null && row.tracker.trackerPosition.bettery_charge_parcentage !== null ? "B: "+row.tracker.trackerPosition.bettery_charge_parcentage : "B: "+ "OFF"}`}

                                //animation={this.props.google.maps.Animation.DROP}
                                position={{
                                    lat: JSON.parse(row.tracker.trackerPosition.coordinates)[0],
                                    lng: JSON.parse(row.tracker.trackerPosition.coordinates)[1]
                                }}>

                            </Marker>

                        ):'')}

                        {/*{this.props.mapData === 0 &&*/}
                        {/*this.props.TrackerLatLong.rows.map(row => row.tracker.trackerPosition !== null ? (*/}
                            {/*// console.log(marker.coordinates[0])*/}
                            {/*//JSON.parse(marker.coordinates)*/}
                            {/*<Marker*/}
                                {/*icon={iconMarker}*/}
                                {/*//onClick={(props, marker, e) => this.onMarkerClick(props, marker, e, row.tracker.trackerPosition)}*/}
                                {/*name={'Current location'}*/}
                                {/*title={JSON.stringify(row.tracker.trackerPosition.coordinates)}*/}
                                {/*key={row.tracker.trackerPosition.id}*/}
                                {/*label={ `${row.tracker.trackerConfiguration !== null ? row.tracker.trackerConfiguration.givenName : row.tracker.name}` +" "+ `${JSON.stringify(row.tracker.trackerPosition.positionStatus != null ? row.tracker.trackerPosition.positionStatus.status : "N/A")}`+" "+`${row.tracker.trackerPosition !== null && row.tracker.trackerPosition.bettery_charge_parcentage !== null ? "B: "+row.tracker.trackerPosition.bettery_charge_parcentage : "B: "+'N/A'}`}*/}

                                {/*//animation={this.props.google.maps.Animation.DROP}*/}
                                {/*position={{*/}
                                    {/*lat: JSON.parse(row.tracker.trackerPosition.coordinates)[0],*/}
                                    {/*lng: JSON.parse(row.tracker.trackerPosition.coordinates)[1]*/}
                                {/*}}>*/}

                            {/*</Marker>*/}

                        {/*):'')}*/}

                        {/*{this.props.mapData !== 0 &&*/}
                        {/*this.props.TrackerLatLong.rows.map(row =>  row.tracker.trackerPosition !== null ? (*/}
                            {/*//console.log("marker", row)*/}
                            {/*//JSON.parse(marker.coordinates)*/}
                            {/*<Marker*/}
                                {/*icon={iconMarker}*/}
                                {/*onClick={(props, marker, e) => this.onMarkerClick(props, marker, e, row.tracker.trackerPosition)}*/}
                                {/*name={'Current location'}*/}
                                {/*title={JSON.stringify(row.tracker.trackerPosition.coordinates)}*/}
                                {/*key={row.tracker.trackerPosition.id}*/}
                                {/*label={ `${row.tracker.trackerConfiguration !== null ? row.tracker.trackerConfiguration.givenName : row.tracker.name}` +" "+ `${JSON.stringify(row.tracker.trackerPosition.positionStatus != null ? row.tracker.trackerPosition.positionStatus.status : "N/A")}`+" "+`${row.tracker.trackerPosition !== null && row.tracker.trackerPosition.bettery_charge_parcentage !== null ? "B: "+row.tracker.trackerPosition.bettery_charge_parcentage : "B: "+'N/A'}`}*/}

                                {/*//animation={this.props.google.maps.Animation.DROP}*/}
                                {/*position={{*/}
                                    {/*lat: JSON.parse(row.tracker.trackerPosition.coordinates)[0],*/}
                                    {/*lng: JSON.parse(row.tracker.trackerPosition.coordinates)[1]*/}
                                {/*}}>*/}

                            {/*</Marker>*/}

                        {/*):'')}*/}

                        {this.props.mapData !== 0 && this.props.TrackerData !== null &&
                        this.props.TrackerData.rows.map(row =>  row.coordinates !== null ? (
                            //console.log("marker", this.props.TrackerData.rows.findIndex(obj => obj.id===row.id))

                            this.props.TrackerData.rows.findIndex(obj => obj.id === row.id) === 0 ?
                            <Marker
                                icon={this.props.trackerRow.tracker.isOnline === true ? iconMarker : offlineIconMarker}
                                onClick={(props, marker, e) => this.onMarkerClick(props, marker, e, row)}
                                name={'Current location'}
                                title={JSON.stringify(row.coordinates)}
                                key={row.id}
                                //label={ `${row.tracker.trackerConfiguration !== null ? row.tracker.trackerConfiguration.givenName : row.tracker.name}` +" "+ `${JSON.stringify(row.tracker.trackerPosition.positionStatus != null ? row.tracker.trackerPosition.positionStatus.status : "N/A")}`+" "+`${row.tracker.trackerPosition !== null && row.tracker.trackerPosition.bettery_charge_parcentage !== null ? "B: "+row.tracker.trackerPosition.bettery_charge_parcentage : "B: "+'N/A'}`}
                                label={ `${this.props.trackerName}`}
                                position={{
                                    lat: JSON.parse(row.coordinates)[0],
                                    lng: JSON.parse(row.coordinates)[1]
                                }}>
                            </Marker> :
                             <Marker
                                icon={iconMarker_3}
                                onClick={(props, marker, e) => this.onMarkerClick(props, marker, e, row)}
                                name={'Current location'}
                                title={JSON.stringify(row.coordinates)}
                                key={row.id}
                                //label={ `${row.tracker.trackerConfiguration !== null ? row.tracker.trackerConfiguration.givenName : row.tracker.name}` +" "+ `${JSON.stringify(row.tracker.trackerPosition.positionStatus != null ? row.tracker.trackerPosition.positionStatus.status : "N/A")}`+" "+`${row.tracker.trackerPosition !== null && row.tracker.trackerPosition.bettery_charge_parcentage !== null ? "B: "+row.tracker.trackerPosition.bettery_charge_parcentage : "B: "+'N/A'}`}
                                position={{
                                    lat: JSON.parse(row.coordinates)[0],
                                    lng: JSON.parse(row.coordinates)[1]
                                }}>
                             </Marker>

                        ):'')}


                        {/*<Marker*/}
                        {/*//icon={iconMarker}*/}
                        {/*onClick={(props, marker, e) => this.onMarkerClick(props, marker, e, this.props.TrackerLatLong.rows[0])}*/}
                        {/*name={'Current location'}*/}
                        {/*//title={JSON.stringify(marker.id)}*/}
                        {/*//key={row.id}*/}
                        {/*//label={JSON.stringify(marker.id)}*/}
                        {/*//animation={this.props.google.maps.Animation.DROP}*/}
                        {/*position={{ lat: JSON.parse(this.props.TrackerLatLong.rows[0].coordinates)[0], lng: JSON.parse(this.props.TrackerLatLong.rows[0].coordinates)[1] }}*/}
                        {/*>*/}
                        {/*</Marker>*/}



                        {/*{ this.props.TrackerLatLong.rows.map(marker => (*/}
                        {/*<InfoWindow*/}
                        {/*key={marker.id}*/}
                        {/*marker={marker}*/}
                        {/*visible={true}*/}
                        {/*>*/}
                        {/*<div>*/}
                        {/*<h6>Last Tracking Time</h6>*/}
                        {/*/!*<div>{ lastTime.ltime }</div>*!/*/}
                        {/*</div>*/}
                        {/*</InfoWindow>*/}
                        {/*))*/}
                        {/*}*/}


                        { this.state.showingInfoWindow &&
                        <InfoWindow
                        marker={this.state.activeMarker}
                        visible={true}
                        >
                        <div className="text-center">
                        <h6>{this.props.trackerName}</h6>
                        {/*<div>{ this.state.date }</div>*/}
                        <div>{ this.state.address }</div>
                        <div>{ this.state.speed != null ? this.state.speed : "Status Not Available" }</div>
                        </div>
                        </InfoWindow>
                        }
                    </Map>
                </div>
            </div>
        );
    }
}

function mapStateToProps(state) {
    console.log('SingleTrackerMap------mapStateToProps', state.tracker.TrackerLatestData, state.tracker.TrackerData);
    return {
        TrackerLatLong: state.tracker.TrackerLatestData,
        TrackerData: state.tracker.TrackerData
    };
}

const Container = connect(mapStateToProps, { getTrackersPosition, getUserTrackersLatestPosition, getUserSingleTrackerLatestPosition, getTrackerPosition })(SingleTrackerMap);

export default GoogleApiWrapper({
    apiKey: 'AIzaSyAIKAIgi1_Nh89lqUJflnAxk_V_IEj92Ys'
})(Container);

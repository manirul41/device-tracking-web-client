import React, { Component } from 'react';
import { Map, Circle, Marker, Polygon, InfoWindow, GoogleApiWrapper } from 'google-maps-react';
import ReactLoading from 'react-loading';

const mapStyles = {
    width: '100%',
    height: '400px'
};

class SetMapCircle extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dropdownVisibility: '',
            showingInfoWindow: true,
            activeMarker: {},
            selectedPlace: {}
        };
        this.onMarkerClick = this.onMarkerClick.bind(this);
        this.onMapClick = this.onMapClick.bind(this);
        this.onMarkerDragEnd = this.onMarkerDragEnd.bind(this);
    }

    onMarkerClick(props, marker, e) {
        this.setState({
            selectedPlace: props,
            activeMarker: marker,
            showingInfoWindow: true
        });
    }

    onMapClick(props) {
        if (this.state.showingInfoWindow) {
            this.setState({
                showingInfoWindow: false,
                activeMarker: null
            });
        }
    }

    componentDidMount() {
        //console.log('from componentDidMount', this.props);
        //this.props.getTrackerPosition(this.props.mapData);
    }

    // componentDidUpdate(prevProps) {
    //     //console.log('before componentDidUpdate', prevProps);
    //     if (this.props.mapData !== prevProps.mapData) {
    //         this.props.getTrackerPosition(this.props.mapData);
    //     }
    // }

    // renderMarkers(points) {
    //     return points.map((point) => (
    //         <Marker
    //             title={`${point.latitude}, ${point.longitude}`}
    //             key={point.id}
    //             position={{ lat: parseFloat(point.latitude), lng: parseFloat(point.longitude) }}
    //         />
    //     ));
    // }
    onMarkerDragEnd(mapProps, map) {
        console.log(mapProps);
        const { latLng } = coord;
        const lat = latLng.lat();
        const lng = latLng.lng();
        console.log('dskj', latLng, lat, lng, map);

        this.setState(prevState => {
            const markers = [...this.state.markers];
            markers[index] = { ...markers[index], position: { lat, lng } };
            //console.log('markers', markers);
            return { markers };
        });
    }

    render() {
        if (this.props.radius === undefined){
            return <ReactLoading className='relaod-logo-css' type="spinningBubbles" color="#aaaaaa" height={50} width={50} />;
        }

        const coords = { lat: 23.750259800750143, lng: 90.40973424911499 };


        console.log("setmap", parseInt(this.props.radius));

        return (
            <div className="row clearfix">
                <div className="lead">
                    <div style={{ height: '400px' }}>
                        {this.props.markers.map((marker, index) => (
                        <Map
                            key={marker.name}
                            initialCenter={marker.position}
                            google={this.props.google}
                            style={mapStyles}
                            zoom={15}
                        >
                            {this.props.markers.map((marker, index) => (
                                <Marker
                                    key={marker.name}
                                    position={marker.position}
                                    draggable={true}
                                    onDragend={(t, map, coord) => this.props.onMarkerDragEnd(coord, index)}
                                    name={marker.name}
                                />
                            ))}
                            {this.props.markers.map((marker, index) => (
                                <Circle
                                    key={marker.name}
                                    radius={parseInt(this.props.radius)}
                                    center={marker.position}
                                    strokeColor='transparent'
                                    strokeOpacity={0}
                                    strokeWeight={5}
                                    fillColor='#FF0000'
                                    fillOpacity={0.2}
                                />
                            ))}

                        </Map>))}
                        <div className="clearfix" />
                    </div>
                </div>
            </div>
        );
    }
}

// function mapStateToProps(state) {
//     //console.log('SetMapCircle------mapStateToProps', state);
//     return {
//         TrackerLatLong: state.tracker
//     };
// }

//const Container = connect(mapStateToProps, { getTrackerPosition })(SetMapCircle);

export default GoogleApiWrapper({
    apiKey: 'AIzaSyAIKAIgi1_Nh89lqUJflnAxk_V_IEj92Ys'
})(SetMapCircle);

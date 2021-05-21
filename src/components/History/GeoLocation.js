import React, { Component } from 'react';
import Geocode from 'react-geocode';
import ReactLoading from "./FetchHistoryData";

class GeoLocation extends Component {
    constructor(props) {
        super(props);
        this.state = {
            address: ''
        };
    }

    componentDidMount() {
        //lat long to address generator
        let address = '';
        Geocode.setApiKey('AIzaSyAlZStI8_JrKEkE5D4PPn74Q2q6H0zmaow');
        Geocode.enableDebug();
        Geocode.fromLatLng(this.props.lat, this.props.long).then(
        response => {
            //console.log('.........responce', response);
            address = response.results[0].formatted_address;
            //console.log(address);
            this.setState({
                address
            });
        },
        error => {
            console.error(error);
        }
        );
    }
    render() {
        if (this.state.address === null) {
            return <ReactLoading className='relaod-logo-css' type="spinningBubbles" color="#aaaaaa" height={50}
                                 width={50}/>;
        }
        return (
            <div>
                <div><strong>{this.state.address}</strong></div>
                <div>
                    ({this.props.lat}, {this.props.long})
                    <a href={`https://www.google.com/maps/search/?api=1&query=${[this.props.lat,this.props.long]}`} target="_blank"> See On Map</a>
                </div>
            </div>
        );
    }
}

export default GeoLocation;

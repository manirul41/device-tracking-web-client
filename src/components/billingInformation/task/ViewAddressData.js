import React, { Component } from 'react';
import { connect } from 'react-redux';
import ReactLoading from 'react-loading';
import { LOCAL_STORAGE_DATA_KEYNAME } from '../../../actions/types';
import { getSingleUserAddress } from '../../../actions/user';

class ViewAddressData extends Component {
    constructor(props) {
        super(props);
        this.state = {
            id: null,
            isLoading: true
        };
    }

    componentDidMount() {
        const userLocalData = JSON.parse(
            localStorage.getItem(LOCAL_STORAGE_DATA_KEYNAME)
        );
        if (userLocalData != null) {
            const request = this.props.getSingleUserAddress(userLocalData.user.id);
            request.then(() => {
                this.setState({ isLoading: false });
            })
            .catch(() => {

            });
        }
    }

    render() {
        // if (Object.values(this.props.addressData).length === 0) {
        //   return (<ReactLoading
        //     className='relaod-logo-css' type="spinningBubbles" color="#aaaaaa" height={50}
        //     width={50}
        //   />);
        // }
        if (this.props.addressData.userAddressData === null && this.state.isLoading) {
            return (<ReactLoading
className='relaod-logo-css' type="spinningBubbles" color="#aaaaaa" height={50}
                                 width={50} 
            />);
        }
        return (
            <div>
                <div className="ml-3 mb-4">
            <span
                onClick={() =>
                    this.props.triggerCreate()
                }
                className="btn btn-primary"
            >
              Create Address
            </span>
                </div>
                <div className="row">
                    {this.props.addressData.userAddressData.rows.map((address, index) => (
                        <div className="col-md-6" key={index}>
                            <div className="card mb-3 ml-3">
                                <div className="card-header">
                                    <div>
                                        <span onClick={() => this.props.triggerParentUpdate(address)} className="btn btn-primary">Edit</span>
                                    </div>
                                </div>
                                <div className="no-gutters">
                                    <div className="card-body">
                                        <h5>Billing Address</h5>
                                        <div className="card-text">
                                            <table className="table table-borderless table-responsive-md">
                                                <tbody>
                                                <tr>
                                                    <th>Address Type:</th>
                                                    <td>{address.addressType.name}</td>
                                                </tr>
                                                <tr>
                                                    <th>Address:</th>
                                                    <td>{address.address}</td>
                                                </tr>
                                                <tr>
                                                    <th>Secondary Address:</th>
                                                    <td>{address.addressTwo}</td>
                                                </tr>
                                                <tr>
                                                    <th>City:</th>
                                                    <td>{address.city}</td>
                                                </tr>
                                                <tr>
                                                    <th>State:</th>
                                                    <td>{address.state}</td>
                                                </tr>
                                                <tr>
                                                    <th>Zip Code:</th>
                                                    <td>{address.zip}</td>
                                                </tr>
                                                <tr>
                                                    <th>Country:</th>
                                                    <td>{address.country}</td>
                                                </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        addressData: state.user
    };
}

export default connect(
    mapStateToProps,
    { getSingleUserAddress }
)(ViewAddressData);

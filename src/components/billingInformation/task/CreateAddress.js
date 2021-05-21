import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router';
import { postSingleUserAddress } from '../../../actions/user';
import { LOCAL_STORAGE_DATA_KEYNAME } from '../../../actions/types';

const initialState = {
    userId: null,
    address: '',
    addressTwo: '',
    city: '',
    state: '',
    zip: '',
    country: '',
    addressTypeId: 1,
    isRedirect: false
};

class CreateAddress extends Component {
    constructor(props) {
        super(props);
        this.state = {
            ...initialState
        };
        this.changeHandler = this.changeHandler.bind(this);
        this.submitHandler = this.submitHandler.bind(this);
    }

    componentDidMount() {
        const userLocalData = JSON.parse(
            localStorage.getItem(LOCAL_STORAGE_DATA_KEYNAME)
        );
        this.setState({
            userId: userLocalData.user.id
        });
    }

    submitHandler(e) {
        e.preventDefault();
        const changeAddress = {
            address: this.state.address,
            addressTwo: this.state.addressTwo,
            city: this.state.city,
            state: this.state.state,
            zip: this.state.zip,
            addressTypeId: this.state.addressTypeId,
            country: this.state.country,
        };

        const request = this.props.postSingleUserAddress(this.state.userId, changeAddress);
        request
            .then(() => {
                this.setState({ isRedirect: true });
            })
            .catch(() => {
            });
    }

    changeHandler(e) {
        this.setState({ [e.target.name]: e.target.value });
    }

    render() {
        if (this.state.isRedirect) {
            return <Redirect to={'/billing-information'} />;
        }
        return (
            <div className="card">
                <div className="card-header text-center">
                    Create Address
                </div>
                <div className="card-body">
                    <form onSubmit={this.submitHandler}>
                        <input
                            className="btn btn-primary"
                            type="submit"
                            value="Create"
                        />
                        <table className="table table-borderless table-responsive-md">
                            <tbody>
                                <tr>
                                    <td>Address:</td>
                                    <td colSpan='3'>
                                        <input
                                            type="text"
                                            className="form-control"
                                            placeholder="Enter Your Address"
                                            name="address"
                                            required
                                            value={this.state.address}
                                            onChange={this.changeHandler}
                                        />
                                    </td>
                                </tr>
                                <tr>
                                    <td>Address Two:</td>
                                    <td colSpan='3'>
                                        <input
                                            type="text"
                                            className="form-control"
                                            placeholder="Enter Your Address Two"
                                            name="addressTwo"
                                            required
                                            value={this.state.addressTwo}
                                            onChange={this.changeHandler}
                                        />
                                    </td>
                                </tr>
                                <tr>
                                    <td>City:</td>
                                    <td>
                                        <input
                                            type="text"
                                            className="form-control"
                                            placeholder="Enter Your City"
                                            name="city"
                                            required
                                            value={this.state.city}
                                            onChange={this.changeHandler}
                                        />
                                    </td>
                                    <td>State:</td>
                                    <td>
                                        <input
                                            type="text"
                                            className="form-control"
                                            placeholder="Enter Your State"
                                            name="state"
                                            required
                                            value={this.state.state}
                                            onChange={this.changeHandler}
                                        />
                                    </td>
                                    <td>Zip/Postal Code:</td>
                                    <td>
                                        <input
                                            type="number"
                                            className="form-control"
                                            placeholder="Enter Your Zip"
                                            name="zip"
                                            required
                                            value={this.state.zip}
                                            onChange={this.changeHandler}
                                        />
                                    </td>
                                </tr>
                                <tr>
                                    <td>Country:</td>
                                    <td>
                                        <input
                                            type="text"
                                            className="form-control"
                                            placeholder="Enter Your Country"
                                            name="country"
                                            required
                                            value={this.state.country}
                                            onChange={this.changeHandler}
                                        />
                                    </td>
                                    <td>Address Type:</td>
                                    <td>
                                        <select
                                            className="form-control"
                                            name="addressType"
                                            required
                                            onChange={this.changeHandler}
                                        >
                                            <option disabled defaultValue> -- select an option --</option>
                                            <option value={1}>Residence</option>
                                            <option value={2}>Business</option>
                                        </select>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </form>
                </div>
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        userAddress: state.user
    };
}

export default connect(
    mapStateToProps,
    { postSingleUserAddress }
)(CreateAddress);

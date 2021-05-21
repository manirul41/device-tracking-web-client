import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router';
import { putSingleUserAddress } from '../../../actions/user';

class EditAddress extends Component {
    constructor(props) {
        super(props);
        this.state = {
            address: props.posts.address,
            addressTwo: props.posts.addressTwo,
            city: props.posts.city,
            state: props.posts.state,
            zip: props.posts.zip,
            country: props.posts.country,
            isRedirect: false
        };
        this.changeHandler = this.changeHandler.bind(this);
        this.submitHandler = this.submitHandler.bind(this);
    }

    submitHandler(e) {
        e.preventDefault();
        const changeAddress = {
            address: this.state.address,
            addressTwo: this.state.addressTwo,
            city: this.state.city,
            state: this.state.state,
            zip: this.state.zip,
            country: this.state.country,
        };

        const request = this.props.putSingleUserAddress(this.props.posts.userId, this.props.posts.id, changeAddress);
        request
            .then(() => {
                this.setState({ isRedirect: true });
            })
            .catch(() => {
                //console.log('Error Occur', error);
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
                    Change Address
                </div>
                <div className="card-body">
                    <form onSubmit={this.submitHandler}>
                        <input
                            className="btn btn-primary"
                            type="submit"
                            value="Update" 
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
                                    <td>Zip:</td>
                                    <td>
                                        <input
                                            type="text"
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
    { putSingleUserAddress }
)(EditAddress);

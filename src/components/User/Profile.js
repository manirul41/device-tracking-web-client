import React, { Component } from 'react';
import { connect } from 'react-redux';
import ReactLoading from 'react-loading';
import { LOCAL_STORAGE_DATA_KEYNAME } from '../../actions/types';
import { getSingleProfile } from '../../actions/user';
import CreateProfile from './CreateProfile';

class Profile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: null,
      userProfileData: null,
      dataResponse: false
    };
  }

  componentDidMount() {
    const userLocalData = JSON.parse(
        localStorage.getItem(LOCAL_STORAGE_DATA_KEYNAME)
    );
    if (userLocalData != null) {
      const request = this.props.getSingleProfile(userLocalData.user.id);
      request.then(
          response => {
            console.log('user data parsing data', response.payload.data.data);
            console.log('Status Code: ', response.payload.status);
            this.setState({
              userProfileData: response.payload.data.data,
              dataResponse: true
            });
          }
      ).catch(
          error => {
            this.setState({
              userProfileData: null,
              id: userLocalData.user.id,
              dataResponse: false
            });
            console.log('user data parsing error', error.response);
          }
      );
    }
  }

  render() {
    // if (Object.values(this.props.userData).length === 0) {
    //   return (<ReactLoading
    //     className='relaod-logo-css' type="spinningBubbles" color="#aaaaaa" height={50}
    //     width={50}
    //   />);
    // }
   
    if (this.state.dataResponse) {
      if (this.state.userProfileData === null) {
        return <ReactLoading className='relaod-logo-css' type="spinningBubbles" color="#aaaaaa" height={50} width={50} />;
      }
    } else {
      return (<CreateProfile />);
    }

    return (
      <div>
        <div>
          <span
            onClick={() =>
              this.props.triggerParentUpdate(
                  this.state.userProfileData
              )
            }
            className="btn btn-primary"
          >
            Edit
          </span>
        </div>
        <div className="card mb-3">
          <div className="row no-gutters">
            <div className="col-md-3">
            {/* "../../images/faces/face0.png" */}
              <img
                src={this.state.userProfileData.photo !== '' ? this.state.userProfileData.photo : ''}
                className="card-img"
                alt=""
              />
            </div>
            <div className="col-md-6">
              <div className="card-body">
                <h5 className="card-title">Profile</h5>
                <div className="card-text">
                  <table className="table table-borderless table-responsive-md">
                    <tbody>
                      {/* <tr>
                        <th>Id</th>
                        <td>{this.props.userData.userProfileData.id}</td>
                      </tr>
                      <tr>
                        <th>User Id</th>
                        <td>{this.props.userData.userProfileData.userId}</td>
                      </tr> */}
                      <tr>
                        <th>Organization</th>
                        <td>
                          {this.state.userProfileData.organization}
                        </td>
                      </tr>
                      <tr>
                        <th>Gender</th>
                        <td>{this.state.userProfileData.gender}</td>
                      </tr>
                      <tr>
                        <th>NID</th>
                          <td>
                            <img
                                src={this.state.userProfileData.nid !== '' ? this.state.userProfileData.nid : ''}
                                className="card-img"
                                alt="nid"
                            />
                          </td>
                      </tr>
                      <tr>
                        <th>Passport</th>
                        <td>
                            <img
                                src={this.state.userProfileData.passportNo !== '' ? this.state.userProfileData.passportNo : ''}
                                className="card-img"
                                alt="passport"
                            />
                          </td>
                      </tr>
                      <tr>
                        <th>Email</th>
                        <td>
                          {this.state.userProfileData.user.email}
                        </td>
                      </tr>
                      <tr>
                        <th>Name</th>
                        <td>{this.state.userProfileData.user.name}</td>
                      </tr>
                      <tr>
                        <th>User Name</th>
                        <td>
                          {this.state.userProfileData.user.userName}
                        </td>
                      </tr>
                      <tr>
                        <th>Mobile No</th>
                        <td>
                          {this.state.userProfileData.user.mobileNo}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  //console.log('From Profile mapStateToProps', state.user.userProfileData);
  return {
    userData: state.user
  };
}

export default connect(
  mapStateToProps,
  { getSingleProfile }
)(Profile);

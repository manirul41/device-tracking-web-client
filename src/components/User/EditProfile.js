import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router';
import { putSingleUserProfile,
         putSingleUserProfilePicture,
         postSingleUserNidPicture,
         postSingleUserPassportPicture } from '../../actions/user';

class EditProfile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      posts_id: props.posts.id,
      posts_userId: props.posts.userId,
      posts_organization: props.posts.organization,
      posts_gender: props.posts.gender,
      posts_nid: props.posts.nid ? props.posts.nid : '../../../images/faces/face0.png',
      posts_passportNo: props.posts.passportNo ? props.posts.passportNo : '../../../images/faces/face0.png',
      posts_userName: props.posts.user.userName,
      posts_email: props.posts.user.email,
      posts_name: props.posts.user.name,
      posts_mobileNo: props.posts.user.mobileNo,
      posts_photo: props.posts.photo ? props.posts.photo : '../../../images/faces/face0.png',
      isRedirect: false
    };
    this.changeHandler = this.changeHandler.bind(this);
    this.submitHandler = this.submitHandler.bind(this);
  }

  submitHandler(e) {
    e.preventDefault();
    const user = {
      id: this.state.posts_id,
      userId: this.state.posts_userId,
      gender: this.state.posts_gender,
      organization: this.state.posts_organization,
      username: this.state.posts_userName,
      email: this.state.posts_email,
      name: this.state.posts_name,
      mobileNo: this.state.posts_mobileNo
    };

    const userPicture = {
      profile_picture: `url(' ${this.state.posts_photo} ')`
    };
    const userNid = {
      nid_picture: `url('${this.state.posts_nid}')`
    };
    const userPassport = {
      passport_picture: `url('${this.state.posts_passportNo}')`
    };
    const requestPicture = this.props.putSingleUserProfilePicture(user.userId, userPicture);
    const requestNid = this.props.postSingleUserNidPicture(user.userId, userNid);
    const requestPassport = this.props.postSingleUserPassportPicture(user.userId, userPassport);

    const request = this.props.putSingleUserProfile(user.userId, user);
    Promise.all([request.response, requestPicture.response, requestNid.response, requestPassport.response])
    .then(() => {
      alert('Successfull');
      this.setState({ isRedirect: true });
    })
    .catch(() => {
      alert('Error Occured');
    });
  }

  changeHandler(e) {
    // if (e.target.name === 'id') {
    //   this.setState({ posts_id: e.target.value });
    // } else if (e.target.name === 'userId') {
    //   this.setState({ posts_userId: e.target.value });
    // } 
    // else
    if (e.target.name === 'organization') {
      this.setState({ posts_organization: e.target.value });
    } else if (e.target.name === 'gender') {
      this.setState({ posts_gender: e.target.value });
    } else if (e.target.name === 'nid') {
      const reader1 = new FileReader();
      reader1.readAsDataURL(e.target.files[0]);
      reader1.onload = () => this.setState({ posts_nid: reader1.result });
    } else if (e.target.name === 'passportNo') {
      const reader2 = new FileReader();
      reader2.readAsDataURL(e.target.files[0]);
      reader2.onload = () => this.setState({ posts_passportNo: reader2.result });
    } else if (e.target.name === 'userName') {
      this.setState({ posts_userName: e.target.value });
    } else if (e.target.name === 'email') {
      this.setState({ posts_email: e.target.value });
    } else if (e.target.name === 'name') {
      this.setState({ posts_name: e.target.value });
    } else if (e.target.name === 'mobileNo') {
      this.setState({ posts_mobileNo: e.target.value });
    } else if (e.target.name === 'file') {
      const reader = new FileReader();
      reader.readAsDataURL(e.target.files[0]);
      reader.onload = () => this.setState({ posts_photo: reader.result });
    }
  }

  render() {
    if (this.state.isRedirect) {
      return <Redirect to={'/profile'} />;
    }
    return (
      <div>
        <form onSubmit={this.submitHandler}>
          <div className="col-md-4">
            <div className="EditProfile-img">
              <input
                className="btn btn-primary"
                type="submit"
                value="Update"
              />
            </div>
          </div>

          <div className="card mb-3">
          <h5 className="card-header text-center">Change Profile</h5>
            <div className="row no-gutters">
              <div className="col-md-3">
                <img
                  src={this.state.posts_photo}
                  alt="profile"
                  className="img-thumbnail"
                />
                <input
                  type="file"
                  name="file"
                  className="form-control"
                  onChange={this.changeHandler}
                />
              </div>
              <div className="col-md-6">
                <div className="card-body">
                  <h5 className="card-title">Profile</h5>
                  <div className="card-text">
                    <table className="table table-borderless table-responsive-md">
                      <tbody>
                        <tr>
                          <th>Organization</th>
                          <td>
                            <input
                              type="text"
                              className="form-control"
                              placeholder="Enter Your Organization"
                              name="organization"
                              value={this.state.posts_organization}
                              onChange={this.changeHandler}
                            />
                          </td>
                        </tr>
                        <tr>
                          <th>Gender</th>
                          <td>
                            <input
                              type="text"
                              className="form-control"
                              placeholder="Enter Your Gender"
                              name="gender"
                              value={this.state.posts_gender}
                              onChange={this.changeHandler}
                            />
                          </td>
                        </tr>
                        <tr>
                          <th>NID</th>
                          <td>
                            <img
                                src={this.state.posts_nid}
                                alt="NID"
                                className="img-thumbnail"
                            />
                            <input
                                type="file"
                                name="nid"
                                required
                                className="form-control"
                                onChange={this.changeHandler}
                            />
                          </td>
                        </tr>
                        <tr>
                          <th>Passport</th>
                          <td>
                            <img
                              src={this.state.posts_passportNo}
                              alt="Passport"
                              className="img-thumbnail"
                            />
                            <input
                              type="file"
                              name="passportNo"
                              required
                              className="form-control"
                              onChange={this.changeHandler}
                            />
                          </td>
                        </tr>
                        <tr>
                          <th>Email</th>
                          <td>
                            <input
                              type="text"
                              className="form-control"
                              placeholder="Enter Your Email"
                              name="email"
                              value={this.state.posts_email}
                              onChange={this.changeHandler}
                              disabled
                            />
                          </td>
                        </tr>
                        <tr>
                          <th>Name</th>
                          <td>
                            <input
                              type="text"
                              className="form-control"
                              placeholder="Enter Your Name"
                              name="name"
                              value={this.state.posts_name}
                              onChange={this.changeHandler}
                            />
                          </td>
                        </tr>
                        <tr>
                          <th>User Name</th>
                          <td>
                            <input
                              type="text"
                              className="form-control"
                              placeholder="Enter Your User Name"
                              name="userName"
                              value={this.state.posts_userName}
                              onChange={this.changeHandler}
                              disabled
                            />
                          </td>
                        </tr>
                        <tr>
                          <th>Mobbile No</th>
                          <td>
                            <input
                              type="text"
                              className="form-control"
                              placeholder="Enter Your Mobile No"
                              name="mobileNo"
                              value={this.state.posts_mobileNo}
                              onChange={this.changeHandler}
                              disabled
                            />
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    );
  }
}

function mapStateToProps(state) {
  console.log('From EditProfile mapStateToProps.................', state);
  return {
    userData: state
  };
}

export default connect(
  mapStateToProps,
  { putSingleUserProfile, putSingleUserProfilePicture, postSingleUserNidPicture, postSingleUserPassportPicture }
)(EditProfile);

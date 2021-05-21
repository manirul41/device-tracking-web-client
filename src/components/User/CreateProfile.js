import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router';
import { LOCAL_STORAGE_DATA_KEYNAME } from '../../actions/types';
import { postSingleProfile,
         putSingleUserProfilePicture,
         postSingleUserNidPicture,
         postSingleUserPassportPicture } from '../../actions/user';


class CreateProfile extends Component {
  constructor(props) {
      super(props);
      this.state = {
        id: null,
        posts_userId: '',
        posts_organization: '',
        posts_gender: '',
        posts_nid: '../../../images/faces/face0.png',
        posts_passport: '../../../images/faces/face0.png',
        posts_userName: '',
        posts_email: '',
        posts_name: '',
        posts_mobileNo: '',
        posts_photo: '../../../images/faces/face0.png',
        isRedirect: false
      };
      this.changeHandler = this.changeHandler.bind(this);
      this.submitHandler = this.submitHandler.bind(this);
  }

    
  componentDidMount() {
    const userLocalData = JSON.parse(
      localStorage.getItem(LOCAL_STORAGE_DATA_KEYNAME)
    );
    this.setState({
        id: userLocalData.user.id
    });
  }

  changeHandler(e) {
      if (e.target.name === 'organization') {
        this.setState({ posts_organization: e.target.value });
      } else if (e.target.name === 'gender') {
        this.setState({ posts_gender: e.target.value });
      } else if (e.target.name === 'nid') {
        const reader = new FileReader();
        reader.readAsDataURL(e.target.files[0]);
        reader.onload = () => this.setState({ posts_nid: reader.result });
      } else if (e.target.name === 'passport') {
        const reader = new FileReader();
        reader.readAsDataURL(e.target.files[0]);
        reader.onload = () => this.setState({ posts_passport: reader.result });
      } else if (e.target.name === 'userName') {
        this.setState({ posts_userName: e.target.value });
      } else if (e.target.name === 'name') {
        this.setState({ posts_name: e.target.value });
      } else if (e.target.name === 'profile') {
        const reader = new FileReader();
        reader.readAsDataURL(e.target.files[0]);
        reader.onload = () => this.setState({ posts_photo: reader.result });
      }
  }

  submitHandler(e) {
      e.preventDefault();
      const user = {
        gender: this.state.posts_gender,
        organization: this.state.posts_organization,
        name: this.state.posts_name,
      };
  
      const userPicture = {
        profile_picture: `url('${this.state.posts_photo}')`
      };
      const userNid = {
        nid_picture: `url('${this.state.posts_nid}')`
      };
      const userPassport = {
        passport_picture: `url('${this.state.posts_passport}')`
      };
  
      console.log('user-----profile', userPicture);
  
      const requestProfile = this.props.postSingleProfile(this.state.id, user);
      const requestPicture = this.props.putSingleUserProfilePicture(this.state.id, userPicture);
      const requestNid = this.props.postSingleUserNidPicture(this.state.id, userNid);
      const requestPassport = this.props.postSingleUserPassportPicture(this.state.id, userPassport);
      
      Promise.all([requestProfile.response, requestPicture.response, requestNid.response, requestPassport.response])
      .then(() => {
        alert('Successfull');
        this.setState({ isRedirect: true });
      })
      .catch(() => {
        alert('Error Occured');
      });
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
                          value="Create Profile"
                      />
                  </div>
              </div>

              <div className="card mb-3">
                  <h5 className="card-header text-center">Create Profile</h5>
                  <div className="row no-gutters">
                      <div className="col-md-3">
                          <img
                              src={this.state.posts_photo}
                              alt="Profile"
                              className="img-thumbnail"
                          />
                          <input
                              type="file"
                              name="profile"
                              required
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
                                                  required
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
                                                  required
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
                                            src={this.state.posts_passport}
                                            alt="Passport"
                                            className="img-thumbnail"
                                          />
                                          <input
                                            type="file"
                                            name="passport"
                                            required
                                            className="form-control"
                                            onChange={this.changeHandler}
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
                                            required
                                            value={this.state.posts_name}
                                            onChange={this.changeHandler}
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
  return {
    userData: state.user
  };
}

export default connect(
  mapStateToProps,
  { postSingleProfile,
    putSingleUserProfilePicture,
    postSingleUserNidPicture,
    postSingleUserPassportPicture }
)(CreateProfile);

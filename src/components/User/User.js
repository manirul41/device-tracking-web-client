import React, { Component } from 'react';
import SidebarView from '../common/SidebarView';
import NavBar from '../common/NavBar';
import Profile from './Profile';
import EditProfile from './EditProfile';

class User extends Component {
  constructor(props) {
    super(props);
    this.state = {
      posts: null,
      isViewProfile: true,
      isEditProfile: false,
      isViewEditButton: true
    };
    this.clickEdit = this.clickEdit.bind(this);
  }

  clickEdit(obj) {
    console.log('clicked edit button..................', obj);
    Object.keys(obj).forEach((key) => {
      const val = obj[key];
      if (val == null || val === undefined) {
        obj[key] = '';
      }
    });
    this.setState({
      isViewProfile: false,
      isEditProfile: true,
      isViewEditButton: false,
      posts: obj
    });
  }

  render() {
    return (
      <div id="wrapper" className="toggled">
        <SidebarView selected="/" />
        <div id="page-content-wrapper " className="">
          <NavBar />
          <div className="container-fluid">
            <h1>User</h1>

            {this.state.isViewProfile && <Profile triggerParentUpdate={this.clickEdit} />}
            {this.state.isEditProfile && (
              <EditProfile posts={this.state.posts} />
            )}
          </div>
        </div>
      </div>
    );
  }
}

export default User;

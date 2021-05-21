import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { logout } from '../../actions/auth_actions';
import { getSingleProfile } from '../../actions/user';
import { LOCAL_STORAGE_DATA_KEYNAME } from '../../actions/types';

class NavBarMenuWrapper extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dropdownVisibility: '',
            userProfileData: null,
            dataResponse:false
        };
        this.openDropDown = this.openDropDown.bind(this);
        this.logout = this.logout.bind(this);
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
                    this.setState({
                        userProfileData: response.payload.data.data,
                        dataResponse: true
                    })
                }
            ).catch(
                error => {
                    this.setState({
                        userProfileData: null,
                        dataResponse: false
                    })
                    console.log('user data parsing error', error.response);
                }
            );

        }
    }


    logout(e) {
        e.preventDefault();
        console.log('inside logout........');
        this.props.logout();
    }

  openDropDown(e) {
      e.preventDefault();
      console.log('Inside open drop down: ', e.target);
      if (this.state.dropdownVisibility === '') {
          this.setState({ dropdownVisibility: 'show' });
      } else {
          this.setState({ dropdownVisibility: '' });
      }
  }
  render() {
    const userLocalData = JSON.parse(localStorage.getItem(LOCAL_STORAGE_DATA_KEYNAME));
      // if (this.props.userProfileDataResponse === null) {
      //     return <ReactLoading className='relaod-logo-css' type="spinningBubbles" color="#aaaaaa" height={50} width={50} />;
      // }
    return (
        <div className="navbar-menu-wrapper d-flex align-items-stretch mr-4 ">
            {/*<div className="nav-item d-flex align-items-center mx-1 ">*/}
                {/*<div> */}
                   {/*<Link className="nav-link" to='#'> */}
                     {/*<i className="far fa-comments" />*/}
                     {/*<span className="count-symbol bg-warning" />*/}
                   {/*</Link>*/}
                {/*</div>*/}
            {/*</div>*/}
            {/*<div className="nav-item d-flex align-items-center mx-2">*/}
                {/*<div>*/}
                   {/*<Link className="nav-link" to='#'> */}
                     {/*<i className="fas fa-bell" />*/}
                     {/*<span className="count-symbol bg-danger" />*/}
                   {/*</Link>*/}
                {/*</div>*/}
            {/*</div>*/}

            <div className=" d-flex align-items-stretch"> 
                <div className="border my-2 mr-2" /> 
            </div>

            <div className="nav-item nav-profile dropdown mx-1 row  d-flex align-items-center">
                <div className="dropdown ">
                    <Link 
                        className=" dropdown-toggle text-white" to="#" role="button" id="dropdownMenuLink"
                        data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"
                        onClick={this.openDropDown}
                    >
                        { userLocalData !== null ? userLocalData.user.userName : '' }
                    </Link>
                    <div
                        className={`dropdown-menu dropdown-menu-right
                                    ${this.state.dropdownVisibility}`}
                        aria-labelledby="dropdownMenuLink"
                    >
                        <Link className="dropdown-item" to="/profile">View Profile</Link>
                        <Link className="dropdown-item" to="/billing-information">Billing Information</Link>
                        <Link className="dropdown-item" to="/change-password">Change Password</Link>
                        {/*<Link className="dropdown-item" to="/anotheraction">Another action</Link>*/}
                        <Link className="dropdown-item" to="#" onClick={this.logout} >
                            Logout
                        </Link>
                    </div>
                </div>
                <Link 
                    className="nav-link" id="profileDropdown" to="#" data-toggle="dropdown" 
                    aria-expanded="false"
                >
                    <div className="nav-profile-img ml-1">
                        <img 
                            width="30"
                            src={this.state.dataResponse === true ? this.state.userProfileData.photo : ''}
                            //alt="profile"
                            className="rounded-circle"
                        />
                        <span className="availability-status online" />      
                    </div>
                </Link>
            </div>
        </div> 
    );
  }
}

function mapStateToProps(state) {
    //console.log('From nav mapStateToProps.................', state.user.userProfileData);
    return {
        userProfileDataResponse: state.user.userProfileData
    };
}

export default connect(mapStateToProps, { logout, getSingleProfile })(NavBarMenuWrapper);

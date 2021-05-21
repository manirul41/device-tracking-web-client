import React, { Component } from 'react'; 
import { Field, reduxForm } from 'redux-form';
import { Redirect } from 'react-router';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux'; 

import { renderField } from '../reduxFormHelper/renderField';
import { LOCAL_STORAGE_DATA_KEYNAME } from '../../actions/types';

//import FlashMessagesList from '../flash/FlashMessagesList';
import LoginError from './LoginError'; 
import setAuthorizationData from '../../utils/setAuthorizationData';
import { setCurrentUser, attemptLogin } from '../../actions/auth_actions'; 
import { getSingleUser, getSingleUserRoles } from '../../actions/user'; 
import { loadingAnimation } from '../common/constantValues';


let loginerror = '';
class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
        loginerroroccured: false,
        redirect: false,
        loadingAnimation: false,
        response_type: 1
    };
    this.getSingleUserInfo = this.getSingleUserInfo.bind(this);
    this.getRolesAndSaveMergedUserDataInLS = this.getRolesAndSaveMergedUserDataInLS.bind(this);
  }

  componentWillMount() {
    if (localStorage.getItem(LOCAL_STORAGE_DATA_KEYNAME)) {
        //console.log('Login.js/  componenetWillMount: userData GOOOOOOTTTTTTT');
        this.setState({ redirect: true });
     } else {
       this.setState({ redirect: false });
     }
  }

  onCheckBox() {
      console.log('callede');
      this.setState({ response_type: 1 });
  }


  onSubmit(values) {
      const obj = {
          email: values.email,
          password: values.password,
          response_type: this.state.response_type,
          user: 1
      };
      console.log(obj);

    //console.log('onSumit ----------->>>: ', jsonStr);
    this.setState({ loadingAnimation: true });
    const request = this.props.attemptLogin(obj);
    request.then(
        response => {
            console.log('Login Successssssssssss', response);
                const loginSuccessResponse = response.payload.data;

                //console.log(loginSuccessResponse.user.userRoles[0].role.name);
                for (let i = 0; i < loginSuccessResponse.user.userRoles.length; i++) {
                    if (loginSuccessResponse.user.isActive === false || loginSuccessResponse.user.isVerified === false || loginSuccessResponse.user.isPasswordReset === false) {
                        loginerror = '';

                        if (loginSuccessResponse.user.isActive === false){
                            loginerror = loginerror + ' Account is not active!';
                        }

                        if (loginSuccessResponse.user.isVerified === false){
                            loginerror = loginerror + ' Account is not verified!';
                        }

                        if (loginSuccessResponse.user.isPasswordReset === false){
                            loginerror = loginerror + ' Account need reset default password!';
                        }

                        loginerror = loginerror + ' Please contact Zoya';

                        this.setState({
                            loginerroroccured: true,
                            loadingAnimation: false
                        });
                    }
                    if (loginSuccessResponse.user.userRoles[i].role.name === 'admin') {
                        console.log("yessssssss admin")
                        loginerror = 'Access Denied!';
                        this.setState({
                            loginerroroccured: true,
                            loadingAnimation: false
                        });
                    }else {
                        setAuthorizationData(loginSuccessResponse);
                        this.getSingleUserInfo(loginSuccessResponse);
                    }
                }


        }
    ).catch(
        error => {
            console.log('----- onSubmit/ catch.error =====>>>>', error, error.response);
            if (Object.prototype.hasOwnProperty.call(error.response, 'status')) {
                if (error.response.status === 400) {
                    loginerror = error.response.data.errors[0].msg;
                    this.setState({
                        loginerroroccured: true,
                        loadingAnimation: false
                    });
                }
                if (error.response.status === 401) {
                    loginerror = error.response.data.errors[0].msg;
                    this.setState({ loginerroroccured: true, loadingAnimation: false });
                  }
            }
    });
  }

  getSingleUserInfo(loginSuccessResponse) {
    //console.log('getSingle', loginSuccessResponse);
    const request = this.props.getSingleUser(loginSuccessResponse.user.id);
    request.then(
        response => {
          const userInfo = response.payload.data.data;
          this.getRolesAndSaveMergedUserDataInLS(loginSuccessResponse, userInfo);
        }
    ).catch(
        error => {
            console.log('Login.js getSingleUserInfo--- error occured', error, error.response);
        }
    );
  }

  getRolesAndSaveMergedUserDataInLS(loginSuccessResponse, userInfo) {
    const userData = loginSuccessResponse;
    //console.log('get single user data', userData.user.userRoles);
    if (userData.user.userRoles.length > 0){
        const userRoles = userData.user.userRoles;
        //console.log('UserRoles', userRoles);
        const roles = [];
        let now = new Date().getTime();
        userRoles.forEach(element => roles.push(element.roleId));

        userData.firstName = userInfo.firstName;
        userData.lastName = userInfo.lastName;
        userData.roles = roles;
        userData.setupTime = now;

        localStorage.setItem(LOCAL_STORAGE_DATA_KEYNAME, JSON.stringify(userData));
        //console.log('getRolesAndSaveMergedUserDataInLS', userData);
        this.props.setCurrentUser(userData);
        this.setState({ redirect: true, loadingAnimation: false });
    } else {
        loginerror = "User Role Not Found!";
        this.setState({ loginerroroccured: true, loadingAnimation: false });
    }
  }

  render() {
    const { handleSubmit, /*pristine, reset, submitting */ } = this.props;
    if (this.state.redirect) {
        return (<Redirect to={'/'} />);
    }
    return (
    <div className="row">   
      <div className="loginpageleft col-6 mx-0 p-0">
          
          <div>
            <img width="100%" src="../../../images/loginpage/back.jpg" alt="wave" />    
          </div>
        {/* <div>
            <img width="200%" src="../../../images/loginpage/wave_trans3.png" alt="wave" />    
        </div>  
        <div>
            <img width="200%" src="../../../images/loginpage/wave_trans3.png" alt="wave" />     
        </div>
        <div>
            <img width="200%" src="../../../images/loginpage/wave_trans3.png" alt="wave" />      
        </div>
        <div>
            <img width="200%" src="../../../images/loginpage/wave_trans3.png" alt="wave" />    
        </div> */}
      </div>    
      <div className="col-6 p-5 border"> 
        
        <div className=" d-flex justify-content-center align-items-center"> 
            <div>
                <div className="d-flex justify-content-center align-items-center">
                    <span><h4>Zoya Tracking System</h4></span>
                 {/*<img src="../../../images/loginpage/logo.png" alt="People Tracking System" width="50%" />*/}
                </div>
                {
                    (this.state.loadingAnimation) && 
                    loadingAnimation('Loading')
                }
                <div className="d-flex justify-content-center align-items-center">
                    <p 
                        className="text-secondary" 
                        style={{ fontWeight: 300, fontSize: '1vw' }}
                    >
                        Welcome! Please login to your account.
                    </p>
                </div>
             </div>
        </div>
        <div className="col-6 mx-auto">
        <form onSubmit={handleSubmit(this.onSubmit.bind(this))}>
            <div className="form-group">
                <label htmlFor="email" />
                <Field 
                    type="text" 
                    className="loginform" 
                    name="email"
                    placeholder="email"
                    component={renderField}
                />
            </div>
            <div className="form-group ">   
                <label htmlFor="password" /> 
                <Field  
                    type="password" 
                    className="loginform" 
                    name="password" 
                    placeholder="password"
                    component={renderField}
                />
                <LoginError loginerror={loginerror} />
            </div>  
            <div className="d-flex justify-content-between"> 
                <div className="">
                    
                        
                <div className="form-check remembere-check-box-div">
                    <input type="checkbox" className="form-check-input" onClick={this.onCheckBox.bind(this)} id="rememberme" />
                    <label 
                        className="form-check-label" 
                        htmlFor="rememberme" 
                    >
                        Remember me
                    </label>
                </div>
                </div>
                <div className="">
                    <Link className="forgot-password" to="/forget-password">
                        Forgot Password?
                    </Link>
                </div>
            </div>
            <div className="d-flex justify-content-center align-items-center mt-4">
                <button 
                    type="submit" 
                    className="btn text-white px-5 py-1" style={{ background: '#43425D' }}
                >
                    Login
                </button>
            </div>
        </form>
        </div>
       </div> 
    </div>
    );
  }
}

function validate(values) {
  const errors = {};
  if (!values.username) { errors.username = 'Enter Username'; }
  if (!values.password) { errors.password = 'Enter password'; }
  loginerror = '';  
  return errors;
}


function mapStateToProps(state) {
  return state;
}

export default reduxForm({
  form: 'LoginForm',
  validate
})(connect(mapStateToProps, 
    { setCurrentUser, attemptLogin, getSingleUser, getSingleUserRoles })(Login));


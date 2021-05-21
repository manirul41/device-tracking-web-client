import React, { Component } from 'react'; 
import { connect } from 'react-redux'; 
import PropTypes from 'prop-types';
import hasUserTrackerRoleFromLS from "./hasUserTrackerRoleFromLS";
import {LOCAL_STORAGE_DATA_KEYNAME} from "../actions/types";

export default function (ComposedComponent) {
    class Authenticate extends Component {
        componentWillMount() {
            //console.log('utils/requireAuth.js / Authenticate classs_________componentWillMount');

            const userDataString = localStorage.getItem(LOCAL_STORAGE_DATA_KEYNAME);
            const userData = JSON.parse(userDataString);
            if (userData != null) {
                let hours = 4; // Reset when storage is more than 4hours
                let now = new Date().getTime();
                const setupTime = userData.setupTime;
                if (now - setupTime > hours * 60 * 60 * 1000) {
                    localStorage.removeItem(LOCAL_STORAGE_DATA_KEYNAME);
                    this.context.router.history.push('/login');
                }
            }

            if (!this.props.isAuthenticated) {
                this.context.router.history.push('/login');
            }
            console.log(hasUserTrackerRoleFromLS());
        }

        componentWillUpdate(nextProps) {
            if (!nextProps.isAuthenticated) {
                this.context.router.history.push('/');
            }
        }
        
        render() {
          return (<ComposedComponent {...this.props} />);
        }
      }
   
      
    Authenticate.propTypes = {
        isAuthenticated: PropTypes.bool.isRequired,
    };

    Authenticate.contextTypes = {
        router: PropTypes.object.isRequired
    };

    function mapStateToProps(state) {
        return {
            isAuthenticated: state.auth.isAuthenticated
        };
    }  
    return connect(mapStateToProps)(Authenticate); 
}

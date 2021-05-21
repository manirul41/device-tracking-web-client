import { LOCAL_STORAGE_DATA_KEYNAME } from '../actions/types';
import {Redirect} from "react-router";
import React from "react";

export default function getUserTrackerRoleFromLS() {
    /*eslint-disable*/
    const userDataString = localStorage.getItem(LOCAL_STORAGE_DATA_KEYNAME);
    /*eslint-enable*/
    
    const userData = JSON.parse(userDataString);
    let userTracker = false;

    //console.log("userData", userData.user.userRoles)

    if (userData != null) {
        for (let i = 0; i < userData.user.userRoles.length; i++) {
            if (userData.user.userRoles[i].role.name === 'tracker') {
                return userTracker = true;
            }else {
                return userTracker = false;
            }
        }
    }


    
    // if (userData != null) {
    //     userData.token = 'Token Value Changed in this Variable :: at utiils/getUserDataFromLS.js ';
    // }
    //
    // return userData;
}

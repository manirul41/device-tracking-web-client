import axios from 'axios';
import {BASE} from './index';
import {
    SET_CURRENT_USER,
    ATTEMPT_LOGIN,
    LOCAL_STORAGE_DATA_KEYNAME,
    SET_FORGET_PASSWORD,
    SET_FORGET_PASSWORD_VALIDATEPIN, SET_RESET_PASSWORD
} from './types';

import setAuthorizationData from '../utils/setAuthorizationData';

const headers = {
    //'Content-Type': 'application/x-www-form-urlencoded',
    client: 'user'
};

export function setCurrentUser(userData) {
    return {
        type: SET_CURRENT_USER,
        user: userData
    };
}

export function attemptLogin(values) {
    const request = axios.post(`${BASE}/api/auth/login`, values, {headers});
    return {
        type: ATTEMPT_LOGIN,
        payload: request
    };
}

export function logout() {
    localStorage.removeItem(LOCAL_STORAGE_DATA_KEYNAME);
    setAuthorizationData(false);
    return {
        type: SET_CURRENT_USER,
        user: {}
    };
}

export function forgetPassword(userData) {
    const request = axios.post(`${BASE}/api/auth/forgotpassword`, userData);
    return {
        type: SET_FORGET_PASSWORD,
        payload: request
    };
}

export function validatePin(userData) {
    const request = axios.post(`${BASE}/api/auth/forgotpassword/validatepin`, userData);
    return {
        type: SET_FORGET_PASSWORD_VALIDATEPIN,
        payload: request
    };
}

export function resetPassword(userData , headers) {
    const request = axios.post(`${BASE}/api/auth/resetpassword`, userData, {headers});
    return {
        type: SET_RESET_PASSWORD,
        payload: request
    };
}

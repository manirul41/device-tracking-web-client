import axios from 'axios';
import {BASE} from './index';
import {
    CREATE_USER,
    ALL_USERS,
    GET_SINGLE_USER,
    GET_SINGLE_USER_ROLES,
    SEARCH_USERS,
    GET_SINGLE_PROFILE,
    PUT_SINGLE_USER_PROFILE,
    GET_SINGLE_ADDRESS,
    PUT_SINGLE_ADDRESS,
    POST_SINGLE_PROFILE,
    POST_SINGLE_USER_NID_PICTURE,
    POST_SINGLE_USER_PASSPORT_PICTURE,
    POST_SINGLE_ADDRESS, POST_SINGLE_USER_PROFILE_PICTURE, GET_SINGLE_RESIDENCE_ADDRESS
} from './types';

const headers = {
    app_type: 'web',
    client: 'user'
};

export function createUser(values) {
    const request = axios.post(`${BASE}/api/users`, values, {headers});
    return {
        type: CREATE_USER,
        payload: request
    };
}

export function allUsers(limit, offset) {
    const request = axios.get(`${BASE}/api/users?limit=${limit}&&offset=${offset}`);
    return {
        type: ALL_USERS,
        payload: request
    };
}

export function searchUsers(searchParam) {
    console.log('action', searchParam);
    const query = `query={"or":[
    {"username":{"like":"${searchParam}"}},
    {"firstName":{"like":"${searchParam}"}},
    {"lastName":{"like":"${searchParam}"}},
    {"email":{"like":"${searchParam}"}},
    {"mobileNo":{"like":"${searchParam}"}}
    ]}`;
    const request = axios.get(`${BASE}/api/users?${query}`);
    return {
        type: SEARCH_USERS,
        payload: request
    };
}

export function getSingleUser(userId) {
    const request = axios.get(`${BASE}/api/users/${userId}`);
    return {
        type: GET_SINGLE_USER,
        payload: request
    };
}

export function getSingleUserRoles(userId) {
    const request = axios.get(`${BASE}/api/users/${userId}/roles`);
    return {
        type: GET_SINGLE_USER_ROLES,
        payload: request
    };
}

export function getSingleProfile(userId) {
    const request = axios.get(`${BASE}/api/users/${userId}/profile`);
    return {
        type: GET_SINGLE_PROFILE,
        payload: request
    };
}

export function putSingleUserProfile(userId, data) {
    const request = axios.put(`${BASE}/api/users/${userId}/profile`, data);
    return {
        type: PUT_SINGLE_USER_PROFILE,
        payload: request
    };
}
export function postSingleProfile(userId, data) {
    const request = axios.post(`${BASE}/api/users/${userId}/profile`, data);
    return {
        type: POST_SINGLE_PROFILE,
        payload: request
    };
}

export function putSingleUserProfilePicture(userId, data) {
    const request = axios.post(`${BASE}/api/users/${userId}/upload-pp`, data);
    return {
        type: POST_SINGLE_USER_PROFILE_PICTURE,
        payload: request
    };
}
export function postSingleUserNidPicture(userId, data) {
    const request = axios.post(`${BASE}/api/users/${userId}/upload-nid`, data);
    return {
        type: POST_SINGLE_USER_NID_PICTURE,
        payload: request
    };
}
export function postSingleUserPassportPicture(userId, data) {
    const request = axios.post(`${BASE}/api/users/${userId}/upload-passport`, data);
    return {
        type: POST_SINGLE_USER_PASSPORT_PICTURE,
        payload: request
    };
}

export function getSingleUserAddress(userId) {
    const request = axios.get(`${BASE}/api/users/${userId}/addresses?include=[{"model":"AddressType", "as": "addressType"}]`);
    return {
        type: GET_SINGLE_ADDRESS,
        payload: request
    };
}

export function getSingleUserResidenceAddress(userId) {
    const request = axios.get(`${BASE}/api/users/${userId}/addresses?query={"addressTypeId":1}`);
    return {
        type: GET_SINGLE_RESIDENCE_ADDRESS,
        payload: request
    };
}

export function putSingleUserAddress(userId, addressId, address) {
    const request = axios.put(`${BASE}/api/users/${userId}/addresses/${addressId}`, address);
    return {
        type: PUT_SINGLE_ADDRESS,
        payload: request
    };
}

export function postSingleUserAddress(userId, address) {
    const request = axios.post(`${BASE}/api/users/${userId}/addresses/`, address);
    return {
        type: POST_SINGLE_ADDRESS,
        payload: request
    };
}

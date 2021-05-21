import axios from 'axios';

export default function setAuthorizationData(userData) {
    //console.log('setAuthorizationData', userData);
    if (userData) {
        // console.log('Ins setAuthorizationData userData ====== ', userData.token);
        const token = userData.token;
        axios.defaults.headers.common['x-access-token'] = `${token}`;
        // console.log('axios.defaults.headers ===== ', axios.defaults.headers.common);
    } else {
        // console.log('setAuthorizationData.js,  delete authorization header token.');
        delete axios.defaults.headers.common['x-access-token']; 
    }
}

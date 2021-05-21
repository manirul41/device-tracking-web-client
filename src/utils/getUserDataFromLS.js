import { LOCAL_STORAGE_DATA_KEYNAME } from '../actions/types';

export default function getUserDataFromLS() {
    /*eslint-disable*/
    const userDataString = localStorage.getItem(LOCAL_STORAGE_DATA_KEYNAME);
    /*eslint-enable*/
    
    const userData = JSON.parse(userDataString);
    
    if (userData != null) {
        userData.token = 'Token Value Changed in this Variable :: at utiils/getUserDataFromLS.js '; 
    }

    return userData; 
}

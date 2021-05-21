import {
    ALL_USERS,
    SEARCH_USERS,
    GET_SINGLE_PROFILE,
    GET_SINGLE_ADDRESS, GET_SINGLE_RESIDENCE_ADDRESS
} from '../actions/types';
import { updateObject } from './index';

const initialState = {
    userAddressData: null,
    userProfileData: null,
    userResidenceAddressData: null
}

export default (state = {...initialState}, action) => {
    //console.log('action payload----------', action.payload);
    switch (action.type) {
        case ALL_USERS: {
            const result = action.payload.data;
            return updateObject(
                state, { 
                totalRowNo: result.count, 
                perPageRows: result.data, 
                isSearchUser: false
                }
            );
        }
        case SEARCH_USERS: {
            const result = action.payload.data;
            return updateObject(state,
                {
                    totalRowNo: result.count,
                    perPageRows: result.data,
                    isSearchUser: true,
                });
        }
        case GET_SINGLE_PROFILE: {
            const result = action.payload.data;
            //console.log('reducer ........result.data........', result.data);
            return updateObject(state, {
                    userProfileData: result.data
                }
            );
        }
        case GET_SINGLE_ADDRESS: {
            const result = action.payload.data;
            //console.log('result.data:, result.data);
            return updateObject(state, {
                    userAddressData: result.data
                }
            );
        }
        case GET_SINGLE_RESIDENCE_ADDRESS: {
            const result = action.payload.data;
            //console.log('result.data:, result.data);
            return updateObject(state, {
                userResidenceAddressData: result.data
                }
            );
        }
        default:
            return state;
     }
 };  

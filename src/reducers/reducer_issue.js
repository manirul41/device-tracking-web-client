import {
    GET_ALL_ISSUE_TAG, GET_USER_ALL_ISSUE_MESSAGE,
} from '../actions/types';
import { updateObject } from './index';

const initialState = {
    allIssueTagData: null,
    userAllIssueData: null,
};

export default (state = initialState, action) => {
    //console.log('action payload----------', action.payload);
    switch (action.type) {
        case GET_ALL_ISSUE_TAG: {
            const result = action.payload.data;
            return updateObject(
                state, {
                allIssueTagData: result.data
                }
            );
        }
        case GET_USER_ALL_ISSUE_MESSAGE: {
            const result = action.payload.data;
            return updateObject(
                state, {
                userAllIssueData: result.data
                }
            );
        }
        default:
            return state;
     }
 };  

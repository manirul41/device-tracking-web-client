import {
    GET_ALL_TRACKER_HISTORY
} from '../actions/types';
import { updateObject } from './index';

export default (state = null, action) => {
    //console.log('action payload----------', action.payload);
    switch (action.type) {
        case GET_ALL_TRACKER_HISTORY: {
            const result = action.payload.data;
            return updateObject(
                state, {
                    TrackerHistory: result.data
                }
            );
        }
        
        default:
            return state;
     }
 };  

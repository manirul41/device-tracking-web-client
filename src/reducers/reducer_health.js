import {
    GET_ALL_TRACKER_HEALTH
} from '../actions/types';
import { updateObject } from './index';

export default (state = null, action) => {
    //console.log('action payload----------', action.payload);
    switch (action.type) {
        case GET_ALL_TRACKER_HEALTH: {
            const result = action.payload.data;
            return updateObject(
                state, {
                    TrackerHealth: result.data
                }
            );
        }
        
        default:
            return state;
     }
 }; 

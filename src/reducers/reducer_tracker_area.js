import {
    GET_SINGLE_TARGET_TRACKER_AREAS,
} from '../actions/types';
import { updateObject } from './index';

export default (state = null, action) => {
    //console.log('action payload----------', action.payload);
    switch (action.type) {
        case GET_SINGLE_TARGET_TRACKER_AREAS: {
            const result = action.payload.data;
            //console.log('getTrackerPosition', result);
            return updateObject(
                state, {
                TargetAreas: result.data
                }
            );
        }
        default:
            return state;
     }
 };  

import { GET_ALL_TRACKER_REPORT } from '../actions/types';
import { updateObject } from './index';

export default (state = null, action) => {
    switch (action.type) {
        case GET_ALL_TRACKER_REPORT: {
            const result = action.payload.data;
            return updateObject(
                state, {
                    TrackerReport: result.data
                }
            );
        }
        
        default:
            return state;
     }
 };

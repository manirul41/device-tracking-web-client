import {
    DELETE_SINGLE_TARGET_TRACKER_AREA,
    GET_SINGLE_TARGET_TRACKER_AREA,
    GET_SINGLE_TRACKER_POSITION, 
    GET_SINGLE_USER_SINGLE_TRACKER_LATEST_POSITION,
    GET_SINGLE_USER_TRACKER, 
    GET_SINGLE_USER_TRACKER_LATEST_POSITION, GET_USER_ALL_TRACKERS_POSITION,
    SET_TRACKER_ACTIVE,
    GET_ALL_TRACKERS_HEALTH
} from '../actions/types';
import { updateObject } from './index';

const initialState = {
    UserTrackers: null,
    TrackerData: null,
    TrackerLatestData: null,
    SingleTrackerLatestData: null,
    TrackersData: null,
    TargetArea: null,
    ActiveTracker: null,
    TrackerHealth: null
};

export default (state = {...initialState}, action) => {
    //console.log('action payload----------', action.payload);
    switch (action.type) {
        case GET_SINGLE_USER_TRACKER: {
            const result = action.payload.data;
            return updateObject(
                state, {
                UserTrackers: result.data
                }
            );
        }
        case GET_SINGLE_TRACKER_POSITION: {
            const result = action.payload.data;
            //console.log('getTrackerPosition', result);
            return updateObject(
                state, {
                TrackerData: result.data
                }
            );
        }
        case GET_SINGLE_USER_TRACKER_LATEST_POSITION: {
            const result = action.payload.data;
            //console.log('getTrackerPosition', result);
            return updateObject(
                state, {
                TrackerLatestData: result.data
                }
            );
        }
        case GET_SINGLE_USER_SINGLE_TRACKER_LATEST_POSITION: {
            const result = action.payload.data;
            //console.log('getTrackerPosition', result);
            return updateObject(
                ...state, {
                SingleTrackerLatestData: result.data
                }
            );
        }
        case GET_USER_ALL_TRACKERS_POSITION: {
            const result = action.payload.data;
            //console.log('getTrackerPosition', result);
            return updateObject(
                state, {
                TrackersData: result.data
                }
            );
        }
        case GET_SINGLE_TARGET_TRACKER_AREA: {
            const result = action.payload.data;
            //console.log('getTrackerPosition', result);
            return updateObject(
                state, {
                TargetArea: result.data
                }
            );
        }
        case DELETE_SINGLE_TARGET_TRACKER_AREA: {
            const result = action.payload.data;
            //console.log('getTrackerPosition', result);
            return updateObject(
                state, {
                    TargetArea: result.data
                }
            );
        }

        case SET_TRACKER_ACTIVE: {
            const result = action.payload.data;
            return updateObject(
                state, {
                    ActiveTracker: result.data
                }
            );
        }
        case GET_ALL_TRACKERS_HEALTH: {
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

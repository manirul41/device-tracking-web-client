/* eslint-disable max-len */
import axios from 'axios';
import {BASE} from './index';
import {
    GET_SINGLE_USER_TRACKER,
    GET_SINGLE_TRACKER_POSITION,
    SET_TRACKER_CONFIGURATION,
    PUT_TRACKER_CONFIGURATION,
    SET_TRACKER_AREA,
    GET_SINGLE_TARGET_TRACKER_AREAS,
    GET_SINGLE_TARGET_TRACKER_AREA,
    UPDATE_SINGLE_TARGET_TRACKER_AREA,
    DELETE_SINGLE_TARGET_TRACKER_AREA,
    GET_SINGLE_DANGER_TRACKER_AREAS,
    GET_SINGLE_DANGER_TRACKER_AREA,
    SET_PHONE_NUMBER,
    SET_SOS_NUMBER,
    PATCH_PHONE_NUMBER,
    SET_TRACKER_ACTIVE,
    GET_ALL_TRACKER_HISTORY,
    GET_ALL_TRACKERS_HEALTH,
    GET_ALL_TRACKER_REPORT,
    GET_USER_ALL_TRACKERS_POSITION,
    GET_SINGLE_USER_TRACKER_LATEST_POSITION,
    GET_SINGLE_USER_SINGLE_TRACKER_LATEST_POSITION,
    GET_APP_CONFIG_DATA,
    GET_NEAREST_POLICE_STATION_DATA,
    GET_SOS_NUMBER,
    PATCH_SOS_NUMBER, DELETE_PHONE_NUMBER
} from './types';

const headers = {
    app_type: 'web',
    client: 'user'
};

export function getUserTrackers(userId) {
    const request = axios.get(`${BASE}/api/users/${userId}/usertrackers/?include={"model": "Tracker", "as": "tracker", "include":[{"model":"TrackerConfiguration", "as":"trackerConfiguration"},{"model":"TrackerSOSNumber", "as":"trackerSOSNumbers", "include":{"model":"PhoneNumber", "as":"phoneNumber"}}]}`);
    return {
        type: GET_SINGLE_USER_TRACKER,
        payload: request
    };
}

export function getUserTrackersLatestPosition(userId) {
    const request = axios.get(`${BASE}/api/users/${userId}/usertrackers?include={"model": "Tracker", "as": "tracker", "include":[{"model":"TrackerConfiguration", "as":"trackerConfiguration"},{"model":"TrackerPosition", "as":"trackerPosition","include":{"model":"PositionStatus","as":"positionStatus"}}]}`);
    return {
        type: GET_SINGLE_USER_TRACKER_LATEST_POSITION,
        payload: request
    };
}

export function getUserSingleTrackerLatestPosition(userId, trackerId) {
    const request = axios.get(`${BASE}/api/users/${userId}/usertrackers?include={"model": "Tracker", "as": "tracker", "include":[{"model":"TrackerConfiguration", "as":"trackerConfiguration"},{"model":"TrackerPosition", "as":"trackerPosition","include":{"model":"PositionStatus","as":"positionStatus"}}]}&query={"trackerId":{"eq":"${trackerId}"}}`);
    return {
        type: GET_SINGLE_USER_TRACKER_LATEST_POSITION,
        payload: request
    };
}

export function getTrackerPosition(trackerId) {
    const request = axios.get(`${BASE}/api/trackers/${trackerId}/positions?sort_by=date.desc&&offset=0&&query={"coordinates":{"ne":null}}`);
    return {
        type: GET_SINGLE_TRACKER_POSITION,
        payload: request
    };
}

export function getTrackersPosition(trackersID) {
    const request = axios.get(`${BASE}/api/trackerspositions?sort_by=createdAt.desc&&query={"trackerId": [${trackersID}], "and": [{"createdAt": {"gte": "2019-05-20"}}, {"createdAt": {"lte": "2019-07-29"}}]}&&include={"model": "TrackerArea", "as": "trackerArea"}`);
    return {
        type: GET_USER_ALL_TRACKERS_POSITION,
        payload: request
    };
}

export function setTrackerConfiguration(config_data, tracker_id) {
    const request = axios.post(`${BASE}/api/trackers/${tracker_id}/configurations`, config_data);
    return {
        type: SET_TRACKER_CONFIGURATION,
        payload: request
    };
}

export function updateTrackerConfiguration(config_data, tracker_id, config_id) {
    const request = axios.put(`${BASE}/api/trackers/${tracker_id}/configurations/${config_id}`, config_data);
    return {
        type: PUT_TRACKER_CONFIGURATION,
        payload: request
    };
}

export function setTrackerArea(json_area, tracker_id) {
    const request = axios.post(`${BASE}/api/trackers/${tracker_id}/areas`, json_area);
    return {
        type: SET_TRACKER_AREA,
        payload: request
    };
}

export function getSingleTargetTrackerAreas(tracker_id) {
    const request = axios.get(`${BASE}/api/trackers/${tracker_id}/areas`);
    return {
        type: GET_SINGLE_TARGET_TRACKER_AREAS,
        payload: request
    };
}

export function getSingleDangerTrackerAreas(tracker_id) {
    const request = axios.get(`${BASE}/api/trackers/${tracker_id}/areas`);
    return {
        type: GET_SINGLE_DANGER_TRACKER_AREAS,
        payload: request
    };
}

export function getSingleTargetTrackerArea(tracker_id, zone_id) {
    const request = axios.get(`${BASE}/api/trackers/${tracker_id}/areas/${zone_id}`);
    return {
        type: GET_SINGLE_TARGET_TRACKER_AREA,
        payload: request
    };
}

export function updateTrackerArea(json_area, tracker_id, zone_id) {
    const request = axios.put(`${BASE}/api/trackers/${tracker_id}/areas/${zone_id}`, json_area);
    return {
        type: UPDATE_SINGLE_TARGET_TRACKER_AREA,
        payload: request
    };
}

export function deleteSingleTargetTrackerArea(tracker_id, zone_id) {
    const request = axios.delete(`${BASE}/api/trackers/${tracker_id}/areas/${zone_id}`);
    return {
        type: DELETE_SINGLE_TARGET_TRACKER_AREA,
        payload: request
    };
}

export function setPhoneNumber(json_number, user_id) {
    const request = axios.post(`${BASE}/api/users/${user_id}/phones`, json_number);
    return {
        type: SET_PHONE_NUMBER,
        payload: request
    };
}

export function updatePhoneNumber(json_number, user_id, number_id) {
    const request = axios.patch(`${BASE}/api/users/${user_id}/phones/${number_id}`, json_number);
    return {
        type: PATCH_PHONE_NUMBER,
        payload: request
    };
}

export function deletePhoneNumber(user_id, number_id) {
    const request = axios.delete(`${BASE}/api/users/${user_id}/phones/${number_id}`);
    return {
        type: DELETE_PHONE_NUMBER,
        payload: request
    };
}

export function getSOSNumber(tracker_id) {
    const request = axios.get(`${BASE}/api/trackers/${tracker_id}/sosnumbers`);
    return {
        type: GET_SOS_NUMBER,
        payload: request
    };
}

export function setSOSNumber(json_sos_number, tracker_id) {
    const request = axios.post(`${BASE}/api/trackers/${tracker_id}/sosnumbers`, json_sos_number);
    return {
        type: SET_SOS_NUMBER,
        payload: request
    };
}

export function updateSOSNumber(json_sos_number, tracker_id, sos_number_id) {
    const request = axios.patch(`${BASE}/api/trackers/${tracker_id}/sosnumbers/${sos_number_id}`, json_sos_number);
    return {
        type: PATCH_SOS_NUMBER,
        payload: request
    };
}

export function setTrackerActive(value, trackerId) {
    const request = axios.put(`${BASE}/api/trackers/${trackerId}/`, value);
    return {
        type: SET_TRACKER_ACTIVE,
        payload: request
    };
}

export function getTrackersHistory(trackerId, startDate, endDate) {
    let request;
    if (startDate === null) {
        request = axios.get(`${BASE}/api/trackerspositions?sort_by=date.desc&query={"trackerId": [${trackerId}] ,"and": [{"createdAt": {"lte": "${endDate}"}}]}&&include={"model": "TrackerArea", "as": "trackerArea"}`);
    } else if (startDate !== null) {
        request = axios.get(`${BASE}/api/trackerspositions?sort_by=date.desc&query={"trackerId": [${trackerId}] ,"and": [{"createdAt": {"gte": "${startDate}"}}, {"createdAt": {"lte": "${endDate}"}}]}&&include={"model": "TrackerArea", "as": "trackerArea"}`);
    }
    return {
        type: GET_ALL_TRACKER_HISTORY,
        payload: request
    };
}

export function getTrackersHealth(trackerId) {
    const request = axios.get(`${BASE}/api/trackerspositions?sort_by=date.desc&query={"trackerId": [${trackerId}], "and": [{"positionStatusId": {"ne": "null"}}]}&include=[{"model": "TrackerArea", "as": "trackerArea"},{"model":"PositionStatus","as":"positionStatus"}]`);
    return {
        type: GET_ALL_TRACKERS_HEALTH,
        payload: request
    };
}

export function getTrackersReport(trackerId, startDate, endDate) {
    let request;
    if (startDate === null) {
        request = axios.get(`${BASE}/api/trackerspositions?sort_by=createdAt.desc&sort_by=trackerId.asc&query={"trackerId": [${trackerId}] ,"and": [{"createdAt": {"lte": "${endDate}"}}]}&include=[{"model": "TrackerArea", "as": "trackerArea", "include":{"model":"AreaType","as":"areaType"}},{"model":"PositionStatus","as":"positionStatus"}]`);
    } else if (startDate !== null) {
        request = axios.get(`${BASE}/api/trackerspositions?sort_by=createdAt.desc&sort_by=trackerId.asc&query={"trackerId": [${trackerId}] ,"and": [{"createdAt": {"gte": "${startDate}"}}, {"createdAt": {"lte": "${endDate}"}}]}&include=[{"model": "TrackerArea", "as": "trackerArea", "include":{"model":"AreaType","as":"areaType"}},{"model":"PositionStatus","as":"positionStatus"}]`);
    }
    return {
        type: GET_ALL_TRACKER_REPORT,
        payload: request
    };
}

export function getAppConfigurationData() {
    const request = axios.get(`${BASE}/api/appConfig`);
    return {
        type: GET_APP_CONFIG_DATA,
        payload: request
    };
}

export function getNearestPoliceStationData(tracker_id) {
    const request = axios.get(`${BASE}/api/policestations/nearest/${tracker_id}`);
    return {
        type: GET_NEAREST_POLICE_STATION_DATA,
        payload: request
    };
}


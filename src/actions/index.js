import * as ActionTypes from './types';

export const BASE = 'http://zoya.com.bd';
//export const VERSION = 'v1.0';

export const fetchRegionTypes = () => ({
    type: ActionTypes.FETCH_REGION_TYPES
});

export const fetchRegions = () => ({
    type: ActionTypes.FETCH_REGIONS
});

export const deleteRegion = (regionid) => ({
    type: ActionTypes.DELETE_REGION,
    payload: regionid
});

export const createRegion = (region) => ({
    type: ActionTypes.CREATE_REGION,
    payload: region
});

export const resetCreateRegion = () => ({
    type: ActionTypes.RESET_CREATE_REGION
});

export const fetchRegionDetails = (id) => ({
    type: ActionTypes.FETCH_REGION_DETAILS,
    payload: id
});

export const fetchRegionPoints = (id) => ({
    type: ActionTypes.FETCH_REGION_POINTS,
    payload: id
});

export const addRegionPoint = (regionId, point) => ({
    type: ActionTypes.ADD_REGION_POINT,
    payload: {
        regionId,
        point
    }
});

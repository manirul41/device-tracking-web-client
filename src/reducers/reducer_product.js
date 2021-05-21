import { updateObject } from './index';
import {GET_PRODUCTS, GET_SINGLE_USER_INVOICES, GET_USER_PRODUCTS, GET_USER_SUBSCRIPTION} from "../actions/types";

const initialState = {
    UserSubscription: null,
    userProducts: null,
    productList: null,
    invoices: null,
};

export default (state = initialState, action) => {
    //console.log('action payload----------', action.payload);
    switch (action.type) {
        case GET_USER_SUBSCRIPTION: {
            const result = action.payload.data;
            return updateObject(
                state, {
                UserSubscription: result.data
                }
            );
        }
        case GET_USER_PRODUCTS: {
            console.log('action payload getProductsResponse----------', action.payload);
            const result = action.payload.data;
            return updateObject(
                state, {
                    userProducts: result.data
                }
            );
        }
        case GET_PRODUCTS: {
            console.log('action payload getProductsResponse----------', action.payload);
            const result = action.payload.data;
            return updateObject(
                state, {
                    productList: result.data
                }
            );
        }
        case GET_SINGLE_USER_INVOICES: {
            const result = action.payload.data;
            return updateObject(
                state, {
                    invoices: result.data
                }
            );
        }
        default:
            return state;
     }
 };  

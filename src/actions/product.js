import axios from 'axios';
import {BASE} from './index';
import {
    SET_USER_SUBSCRIPTION,
    GET_USER_SUBSCRIPTION,
    GET_PRODUCTS, SET_SUBSCRIPTION_INVOICE, SET_SUBSCRIPTION_INVOICE_SSL, GET_USER_PRODUCTS, GET_SINGLE_USER_INVOICES
} from './types';

const headers = {
    app_type: 'web',
    client: 'user'
};

export function getUserSubscription(userId) {
    const model = `{"model": "Package", "as": "package"}`;
    const request = axios.get(`${BASE}/api/users/${userId}/subscriptions?include=[{"model": "SubscriptionInvoice", "as": "subscriptionInvoices","order": [["createdAt", "DESC"]],"where":{"paymentStatus":{"eq": true}},"include":[{"model": "Subscription", "as": "subscription","include":{"model": "Package", "as": "package"}},{"model": "PackagePrice", "as": "packagePrice","include":{"model":"PriceCycle", "as":"priceCycle"}}]},${model}]`);
    return {
        type: GET_USER_SUBSCRIPTION,
        payload: request
    };
}

export function setUserSubscription(UserSubscriptionData, userId) {
    const request = axios.post(`${BASE}/api/users/${userId}/subscriptions`, UserSubscriptionData);
    return {
        type: SET_USER_SUBSCRIPTION,
        payload: request
    };
}

export function setSubscriptionInvoice(SubscriptionInvoiceData, userSubscriptionId) {
    const request = axios.post(`${BASE}/api/subscriptions/${userSubscriptionId}/invoices`, SubscriptionInvoiceData);
    return {
        type: SET_SUBSCRIPTION_INVOICE,
        payload: request
    };
}

export function setSubscriptionInvoiceSSL(SubscriptionInvoiceId) {
    const request = axios.post(`${BASE}/api/subscriptioninvoices/${SubscriptionInvoiceId}/pay`);
    return {
        type: SET_SUBSCRIPTION_INVOICE_SSL,
        payload: request
    };
}

export function getProductList() {
    const request = axios.get(`${BASE}/api/packages?include={"model": "PackagePrice", "as": "packagePrices","include":{"model":"PriceCycle", "as":"priceCycle"}}`);
    return {
        type: GET_PRODUCTS,
        payload: request
    };
}

export function getUserProductList(userId) {
    const request = axios.get(`${BASE}/api/users/${userId}/subscriptions/?include={"model": "Package", "as": "package","include":{"model": "PackagePrice", "as": "packagePrices","include":{"model":"PriceCycle", "as":"priceCycle"}}}`);
    return {
        type: GET_USER_PRODUCTS,
        payload: request
    };
}

export function getSingleUserInvoices(userId) {
    const request = axios.get(`${BASE}/api/users/${userId}/subscriptions?include=[{"model": "Package", "as": "package"} , {"model": "SubscriptionInvoice", "as": "subscriptionInvoices"}]`);
    return {
        type: GET_SINGLE_USER_INVOICES,
        payload: request
    };
}

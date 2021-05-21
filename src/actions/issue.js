import axios from 'axios';
import {BASE} from './index';
import {
    GET_ALL_ISSUE_TAG, GET_FAQ,
    GET_HELP_CONFIG,
    GET_USER_ALL_ISSUE_MESSAGE,
    SET_ISSUE,
    SET_ISSUE_MESSAGE,
    SET_ISSUE_MESSAGE_REPLY,
} from './types';

export function getAllIssueTags() {
    const request = axios.get(`${BASE}/api/issuetags`);
    return {
        type: GET_ALL_ISSUE_TAG,
        payload: request
    };
}

export function setIssue(issueData) {
    const request = axios.post(`${BASE}/api/issues`, issueData);
    return {
        type: SET_ISSUE,
        payload: request
    };
}

export function setIssueMessage(issueMessageData) {
    const request = axios.post(`${BASE}/api/issues/${issueMessageData.issueId}/messages`, issueMessageData);
    return {
        type: SET_ISSUE_MESSAGE,
        payload: request
    };
}

export function getAllIssueMessage(userId) {
    const request = axios.get(`${BASE}/api/issues?query={"userId": {"eq": ${userId}}}&include=[{"model": "IssueTag", "as": "issueTag"}, {"model": "IssueMessage", "as": "issueMessages"}]`);
    return {
        type: GET_USER_ALL_ISSUE_MESSAGE,
        payload: request
    };
}

export function setIssueMessageReply(issueMessageReplyData) {
    const request = axios.post(`${BASE}/api/issues/${issueMessageReplyData.issueId}/messages`, issueMessageReplyData);
    return {
        type: SET_ISSUE_MESSAGE_REPLY,
        payload: request
    };
}

export function getHelpOptionData(roleName) {
    const request = axios.get(`${BASE}/api/helpConfig/${roleName}`);
    return {
        type: GET_HELP_CONFIG,
        payload: request
    };
}

export function getFAQs() {
    const request = axios.get(`${BASE}/api/faq`);
    return {
        type: GET_FAQ,
        payload: request
    };
}



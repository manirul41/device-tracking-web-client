import _ from 'lodash';
import { SET_CURRENT_USER } from '../actions/types';

const initialState = {
    isAuthenticated: false,
    user: {}
}; 

export default (state = initialState, action) => {
    //console.log('reducer auth-------11', state);
    switch (action.type) {
        case SET_CURRENT_USER:
            // console.log('inside reducer_auth.js', !_.isEmpty(action.payload.user));
            // useless but example
            // return { ...state, adminconfigs: _.mapKeys(action.payload.data, 'name') }; 
            return { ...state, 
                isAuthenticated: !_.isEmpty(action.user),
                user: action.user
            };

        default:
            return state;
     }
};

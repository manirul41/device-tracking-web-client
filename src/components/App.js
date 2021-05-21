import React, { Component } from 'react';
import { Provider } from 'react-redux';

import store from '../config/store';
import { MainRoute } from '../routes';


import setAuthorizationData from '../utils/setAuthorizationData';
import { setCurrentUser } from '../actions/auth_actions';
import { LOCAL_STORAGE_DATA_KEYNAME } from '../actions/types';

if (localStorage[LOCAL_STORAGE_DATA_KEYNAME]) {
  console.log('App.jssssssssssssss === ', localStorage[LOCAL_STORAGE_DATA_KEYNAME]);
  setAuthorizationData(JSON.parse(localStorage[LOCAL_STORAGE_DATA_KEYNAME]));
  store.dispatch(setCurrentUser(JSON.parse(localStorage[LOCAL_STORAGE_DATA_KEYNAME])));
}

class App extends Component {
  render() {
    return (
        <Provider store={store}>
          <MainRoute />
        </Provider>
    );
  }
}

export default App;

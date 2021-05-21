import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';

import Login from '../components/login/Login';
import Dashboard from '../components/Dashboard';
import TrackerConfiguration from '../components/trackerConfiguration/TrackerConfiguration';
import requireAuth from '../utils/requireAuth';
import requireAuthWithTracker from '../utils/requireAuthWithTracker';
import ViewTargetTrackers from '../components/trackerConfiguration/tasks/ViewTargetTrackers';
import ViewDangerTrackers from '../components/trackerConfiguration/tasks/ViewDangerTrackers';
import CreateTrackerZone from '../components/trackerConfiguration/tasks/CreateTrackerZone';
import CreateDangerTrackerZone from '../components/trackerConfiguration/tasks/CreateDangerTrackerZone';
import EditTrackerZone from '../components/trackerConfiguration/tasks/EditTrackerZone';
import EditDangerTrackerZone from '../components/trackerConfiguration/tasks/EditDangerTrackerZone';
import Report from '../components/report/Report';
import Payments from '../components/payments/Payments';
import Inbox from '../components/inbox/Inbox';
import PaymentSuccess from '../components/PaymentSuccess';
import PaymentFail from '../components/PaymentFail';
import User from '../components/User/User';
import ViewTrackerData from '../components/My Tracker/ViewTrackerData';
import ViewHistoryData from '../components/History/ViewHistory';
import viewHealthData from '../components/Health/ViewHealth';
import billingAddress from '../components/billingInformation/BillingAddress';
import ForgetPassword from "../components/login/ForgetPassword";
import ResetPassword from "../components/login/ResetPassword";
import ChangePassword from "../components/login/ChangePassword";
import Help from "../components/help/Help";
import Contact from "../components/contact/Contact";
import SOSConfiguration from "../components/SOSConfiguration/TrackerSOS";
import Faq from "../components/faq/Faq";

const MainRoute = () => (
  <main>
    <Switch>
      <Route path="/login" component={Login} />
      <Route path="/forget-password" component={ForgetPassword} />
      <Route path="/reset-password" component={ResetPassword} />

        <Route exact path="/payment-plan" component={requireAuthWithTracker(Payments)} />
        <Route exact path="/profile" component={requireAuth(User)} />
        <Route exact path="/change-password" component={requireAuth(ChangePassword)} />
        <Route exact path="/billing-information" component={requireAuth(billingAddress)} />
        <Route exact path="/inbox" component={requireAuth(Inbox)} />
        <Route exact path="/help-center" component={requireAuth(Help)} />
        <Route exact path="/help" component={Contact} />
        <Route exact path="/faq" component={Faq} />
        <Route exact path="/my-tracker" component={requireAuthWithTracker(ViewTrackerData)} />
        <Route exact path="/history" component={requireAuthWithTracker(ViewHistoryData)} />
        <Route exact path="/health" component={requireAuthWithTracker(viewHealthData)} />
        <Route exact path="/report" component={requireAuthWithTracker(Report)} />
        <Route exact path="/payment/success" component={PaymentSuccess} />
        <Route exact path="/payment/fail" component={PaymentFail} />
        <Route exact path="/target-zone/:id" component={requireAuthWithTracker(ViewTargetTrackers)} />
        <Route exact path="/target-zone/:id/create-zone" component={requireAuthWithTracker(CreateTrackerZone)} />
        <Route exact path="/target-zone/:id/edit-zone/:zone" component={requireAuthWithTracker(EditTrackerZone)} />
        <Route exact path="/danger-zone/:id/edit-zone/:zone" component={requireAuthWithTracker(EditDangerTrackerZone)} />
        <Route exact path="/danger-zone/:id/create-zone" component={requireAuthWithTracker(CreateDangerTrackerZone)} />
        <Route exact path="/target-zone/:id" component={requireAuthWithTracker(ViewTargetTrackers)} />
        <Route exact path="/danger-zone/:id" component={requireAuthWithTracker(ViewDangerTrackers)} />
        <Route exact path="/configure-tracker" component={requireAuthWithTracker(TrackerConfiguration)} />
        <Route exact path="/sos-number" component={requireAuthWithTracker(SOSConfiguration)} />
          <Route exact path="/" component={requireAuth(Dashboard)} />
    </Switch>
  </main>
);

export { MainRoute };

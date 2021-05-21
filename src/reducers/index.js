import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';
import AuthReducer from './reducer_auth';
import UserReducer from './reducer_user';
import TrackerReducer from './reducer_tracker';
import HistoryReducer from './reducer_history';
import ReportReducer from './reducer_report.js';
import HealthReducer from './reducer_health.js';
import TrackerAreaReducer from './reducer_tracker_area';
import DangerTrackerAreaReducer from './reducer_danger_tracker_area';
import Product from './reducer_product';
import IssueReducer from './reducer_issue';


export function updateObject(oldObject, newValues) {
  return Object.assign({}, oldObject, newValues);
}
export function updateArray(oldObject, newValues) {
  return Object.assign([], oldObject, newValues);
}

const rootReducer = combineReducers({
  form: formReducer,
  auth: AuthReducer,
  user: UserReducer,
  tracker: TrackerReducer,
  trackerArea: TrackerAreaReducer,
  DangerTrackerArea: DangerTrackerAreaReducer,
  history: HistoryReducer,
  health: HealthReducer,
  product: Product,
  issue: IssueReducer,
  report: ReportReducer
});

export default rootReducer;

import React, { Component } from 'react';
import { connect } from 'react-redux';
import Select from 'react-select';
import { getUserTrackers } from '../../actions/tracker';
import { LOCAL_STORAGE_DATA_KEYNAME } from '../../actions/types';

class TrackerSelect extends Component {
  constructor(props) {
    super(props);
    this.state = {
      TrackerData: [],
      initialTrackerId: [],
      trackerId: '',
      trackerName: ''
      // trackerObject: [
      //   name: '',
      //   id: 
      // ]
    };
    this.handleTrackerOption = this.handleTrackerOption.bind(this);
    this.handleChangeFrom = this.handleChangeFrom.bind(this);
  }

  componentDidMount() {
    const userLocalData = JSON.parse(
      localStorage.getItem(LOCAL_STORAGE_DATA_KEYNAME)
    );
    if (userLocalData != null) {
      this.props.getUserTrackers(userLocalData.user.id);
    }
  }

  handleTrackerOption() {
    const sliced = [];
    if (this.state.TrackerData.length <= 0) {
      //console.log(this.props.singleUserTrackers.UserTrackers.rows.length);
      for (
        let i = 0;
        i < this.props.singleUserTrackers.UserTrackers.rows.length;
        i++
      ) {
        sliced.push({
          value: this.props.singleUserTrackers.UserTrackers.rows[i].trackerId,
          label:
            this.props.singleUserTrackers.UserTrackers.rows[i].tracker
              .trackerConfiguration != null
              ? this.props.singleUserTrackers.UserTrackers.rows[i].tracker
                  .trackerConfiguration.givenName
              : `'Tracker' ${i}` 
        });
      }
    }
    //console.log(sliced);
    return sliced;
  }
  handleChangeFrom(obj) {
    console.log('handleChangeFrom ...........obj', obj);
    this.setState({ 
      trackerId: obj.value,
      trackerName: obj.label
    });
}

  render() {
    //console.log('tracker select console log.............working', this.props.parentMethod(5));
    if (this.props.singleUserTrackers == null) {
      return <span>Loading....</span>;
    }
    return (
      <div className="col-12 mt-4">
        <div className="row justify-content-center">
          <div className="col-4 pl-0">
            <Select
            
              placeholder={
                <span className="text-primary">Select Tracker</span>
            }
              options={this.handleTrackerOption()}
              //value={this.props.roles}
              onChange={this.handleChangeFrom}
            />
          </div>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  //console.log('Tracker Select............', state.tracker);
  return {
    singleUserTrackers: state.tracker
  };
}

export default connect(
  mapStateToProps,
  { getUserTrackers }
)(TrackerSelect);

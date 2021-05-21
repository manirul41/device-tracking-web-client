import React, { Component } from 'react';
import Tabs from "react-bootstrap/Tabs";
import Tab from "react-bootstrap/Tab";
import GeneralForm from "./GeneralForm";
import SOSForm from "./SOSForm";


class EditTrackerConfiguration extends Component {
    constructor(props) {
        super(props);
        this.state = {
            activePage: 1,
            key: 'general',
        };
    }

  render() {
    console.log('EditTrackerConfiguration  ==== ', this.props.tracker);
    //const { handleSubmit } = props;
    // if (!this.props.perPageRows) {
    //   return <span>Loading...</span>;
    // }
    //   const classes = useStyles();
    const { handleSubmit, pristine, reset, submitting } = this.props;
    return (
      <div>
          <div className="offset-md-2 col-md-8">
              <div className="card">
                  <div className="card-header d-flex justify-content-between">
                      <span>Edit Tracker Configuration</span>
                      {/*<span>Tracker Id:TR0125R</span>*/}
                  </div>
                  <div className="card-body col-md-10 offset-md-1">
                      <Tabs
                          id="controlled-tab-example"
                          activeKey={this.state.key}
                          onSelect={key => this.setState({ key })}
                      >
                          <Tab eventKey="general" title="General Information">
                              <GeneralForm tracker={this.props.tracker} veiwTracker={this.props.veiwTracker}/>
                          </Tab>
                          <Tab eventKey="sos" title="SOS Number">
                              <SOSForm tracker={this.props.tracker} veiwTracker={this.props.veiwTracker}/>
                          </Tab>
                      </Tabs>
                  </div>
                  <div className="card-footer card-footer-custom">
                      <div className="col-md-10 offset-md-1 pl-0 pr-0">
                          <div className="row d-flex justify-content-between">
                              <a href={`#/target-zone/${this.props.tracker.id}`} className="col-md-4 btn btn-success btn-lg"><small>View Target Zone List</small></a>
                              <a href={`#/danger-zone/${this.props.tracker.id}`} className="col-md-4 btn btn-danger btn-lg"><small>View Danger Zone List</small></a>
                          </div>
                      </div>
                  </div>
              </div>
          </div>
      </div>
    );
  }
}

// function mapStateToProps(state) {
//   console.log('EditTrackerConfiguration promotion === ', promotion);
//   return {
//     totalRowNo: _.isEmpty(promotion) ? 0 : promotion.totalRowNo,
//     perPageRows: _.isEmpty(promotion) ? [] : promotion.perPageRows
//   };
// }


export default EditTrackerConfiguration;


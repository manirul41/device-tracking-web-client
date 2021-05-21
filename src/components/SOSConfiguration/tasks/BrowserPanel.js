import React, {Component, Fragment} from 'react';
import {getTotalRevenue} from '../../../actions/product'

const initialState = {
    isRedirect: false
};

class BrowserPanel extends Component {
    constructor(props){
        super(props);
        this.state = {
            ...initialState
        };
        this.handleButtonCall = this.handleButtonCall.bind(this);
    }

    handleButtonCall(){
        let url = '';
        this.props.handleButtonCall(url);
    }


    render() {
        return (
            <Fragment>
                <div className="d-flex flex-column">
                    <div className="p-2">
                        <span className="btn btn-info" onClick={this.handleButtonCall}>Back</span>
                    </div>
                    <div className="p-2">
                        <iframe src = {this.props.url} width = "100%" height = "500px">
                            Sorry your browser does not support inline frames.
                        </iframe>
                    </div>
                </div>


            </Fragment>
        );
    }
}


export default BrowserPanel;

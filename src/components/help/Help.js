import React, {Component, Fragment} from 'react';
import SidebarView from '../common/SidebarView';
import NavBar from "../common/NavBar";
import BrowserPanel from "./tasks/BrowserPanel";
import {getHelpOptionData} from '../../actions/issue'
import {connect} from "react-redux";
import {LOCAL_STORAGE_DATA_KEYNAME} from "../../actions/types";
import ReactLoading from 'react-loading';

const initialState = {
    isViewHelpPanel: false,
    url: '',
    helpOptionData: undefined
};

class Help extends Component {
    constructor(props) {
        super(props);
        this.state = {
            ...initialState
        };
        this.handleButtonCall = this.handleButtonCall.bind(this);
    }

    componentDidMount() {
        const userLocalData = JSON.parse(localStorage.getItem(LOCAL_STORAGE_DATA_KEYNAME));
        if (userLocalData != null) {
            if (userLocalData.user.userRoles.filter(role => role.roleId === 4).length > 0) {
                this.props.getHelpOptionData('user').then(response => {
                    //console.log("user role data", response.payload.data)
                    this.setState({
                        helpOptionData: response.payload.data.data
                    })
                }).catch(error => {
                    console.log('error', error);
                    this.setState({
                        helpOptionData: undefined,
                    });
                })
            }else {
                this.props.getHelpOptionData('tracker').then(response => {
                    this.setState({
                        helpOptionData: response.payload.data.data
                    })
                }).catch(error => {
                    console.log('error', error);
                    this.setState({
                        helpOptionData: undefined,
                    });
                })
            }
        }

    }


    handleButtonCall(url) {
        this.setState({
            isViewHelpPanel: !this.state.isViewHelpPanel,
            url: url
        })
    }

    renderPerPageRows() {
        const list = this.state.helpOptionData.filter( row => row.status === 'active');
        return _.map(list, row => {
            return (
                <Fragment key={row.name}>
                    <span className="btn btn-info col-md-4 m-2" onClick={() => this.handleButtonCall(row.url)}>{row.name.toUpperCase()}</span>
                </Fragment>
            );
        });
    }


    render() {
        console.log("helpOptionData", this.state.helpOptionData)
        if (this.state.helpOptionData === undefined) {
            return <ReactLoading className='relaod-logo-css' type="spinningBubbles" color="#aaaaaa" height={50} width={50} />;
        }
        return (
            <div id="wrapper" className="toggled">
                <SidebarView selected="/help-center"/>
                <div id="page-content-wrapper " className="">
                    <NavBar/>
                    <div className="container-fluid">
                        <h1>Product Page</h1>
                        {this.state.isViewHelpPanel === false &&

                        <div className="d-flex align-items-center flex-column" style={{marginTop: '10%'}}>
                            {this.renderPerPageRows()}
                        </div>
                        }
                        <div className="row">
                            <div className="col-sm-12">
                                {this.state.isViewHelpPanel &&
                                <BrowserPanel handleButtonCall={this.handleButtonCall} url={this.state.url}/>}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default connect(null, {getHelpOptionData})(Help);

import React, {Component, Fragment} from 'react';
import {getTotalRevenue} from '../../../actions/product'
import Accordion from "react-bootstrap/Accordion";
import Card from "react-bootstrap/Card";
import {getFAQs} from '../../../actions/issue'
import ErrorMessageModal from "../../common/errors/ErrorMessageModal";
import ReactLoading from "react-loading";
import {connect} from "react-redux";

const initialState = {
    isRedirect: false,
    faqData: undefined,
    isCreateError: false,
};

let CreateError = '';


class BrowserPanel extends Component {
    constructor(props) {
        super(props);
        this.state = {
            ...initialState
        };
        this.handleButtonCall = this.handleButtonCall.bind(this);
        this.handleCreateError = this.handleCreateError.bind(this);
        this.renderPerPageRows = this.renderPerPageRows.bind(this);
    }

    componentDidMount() {
        this.props.getFAQs().then(
            response => {
                console.log('faq data parsing---', response.payload.data.data.faq);
                let resData = response.payload.data.data.faq;
                this.setState({
                    faqData: resData
                });

            }).catch(
            error => {
                if (error.response.data.errors.length > 0) {
                    CreateError = `${error.response.data.message + " " + error.response.data.errors[0].msg}`;
                    this.setState({
                        isCreateError: true,
                    });
                } else {
                    CreateError = error.response.data.message;
                    this.setState({
                        isCreateError: true,
                    });
                }
            }
        );
    }

    handleCreateError() {
        this.setState({
            isCreateError: !this.state.isCreateError,
        })
    }

    handleButtonCall() {
        let url = '';
        this.props.handleButtonCall(url);
    }

    renderPerPageRows() {
        const list = this.state.faqData;
        return _.map(list, row => {
            return (
                <Fragment key={row.id}>
                    <Card>
                        <Accordion.Toggle className="btn btn-link" style={{"textDecoration": 'none'}} eventKey={row.id}>
                            <Card.Header className="text-left">
                                <span>Q: {row.id}# {row.question}</span>
                            </Card.Header>
                        </Accordion.Toggle>
                        <Accordion.Collapse eventKey={row.id}>
                            <Card.Body>
                                {row.answer}
                            </Card.Body>
                        </Accordion.Collapse>
                    </Card>
                </Fragment>
            );
        });
    }


    render() {
        if (this.state.faqData === undefined) {
            return <ReactLoading className='relaod-logo-css' type="spinningBubbles" color="#aaaaaa" height={50}
                                 width={50}/>;
        }
        return (
            <Fragment>
                {this.state.isCreateError &&
                <ErrorMessageModal CreateError={CreateError} isCreateError={this.state.isCreateError}
                                   handleCreateError={this.handleCreateError}/>}
                <div className="d-flex flex-column">
                    <div className="p-2">
                        <span className="btn btn-info" onClick={this.handleButtonCall}>Back</span>
                    </div>
                    <div className="p-2">
                        <iframe src={this.props.url} width="100%" height="500px" frameBorder="0">
                            Sorry your browser does not support inline frames.
                        </iframe>
                        {/*<Accordion>*/}
                            {/*{this.state.faqData.length > 0 && this.renderPerPageRows()}*/}
                        {/*</Accordion>*/}
                    </div>
                </div>


            </Fragment>
        );
    }
}


export default connect(null, {getFAQs})(BrowserPanel);

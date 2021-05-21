import React, {Component, Fragment} from 'react';
import {getFAQs} from '../../actions/issue'
import {connect} from "react-redux";
import Navbar from "react-bootstrap/Navbar";
import Accordion from "react-bootstrap/Accordion";
import Nav from "react-bootstrap/Nav";
import Card from "react-bootstrap/Card";
import ReactLoading from 'react-loading';

const initialState = {
    isViewHelpPanel: false,
    url: '',
    contactData: undefined,
    helpOptionData: undefined
};

class Faq extends Component {
    constructor(props) {
        super(props);
        this.state = {
            ...initialState
        };
        this.renderPerPageRows = this.renderPerPageRows.bind(this);
        this.handleButtonCall = this.handleButtonCall.bind(this);
    }

    componentDidMount() {
        this.props.getFAQs().then(
            response => {
                console.log('faq data parsing---+', response.payload.data.data.faq);
                let resData = response.payload.data.data.faq;
                this.setState({
                    contactData: resData
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


    handleButtonCall(url) {
        this.setState({
            isViewHelpPanel: !this.state.isViewHelpPanel,
            url: url
        })
    }

    renderPerPageRows() {
        const list = this.state.contactData;
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
        console.log("helpOptionData", this.state.contactData)
        if (this.state.contactData === undefined) {
            return <ReactLoading className='relaod-logo-css' type="spinningBubbles" color="#aaaaaa" height={50} width={50} />;
        }
        return (
            <div>
                <Navbar collapseOnSelect expand="lg" bg="light" variant="light">
                    {/*<Navbar.Brand href="/">Home</Navbar.Brand>*/}
                    <Navbar.Toggle aria-controls="responsive-navbar-nav"/>
                    <Navbar.Collapse id="responsive-navbar-nav" style={{"backgroundColor": "#f8f9fa"}}>
                        <Nav className="mr-auto ml-2">
                            <Nav.Link href="/">Home</Nav.Link>
                        </Nav>
                    </Navbar.Collapse>
                </Navbar>
                <div className="container-fluid p-0" style={{"height": window.screen.availHeight * .8}}>
                    <div className="d-flex flex-row justify-content-center align-items-center p-0"
                         style={{"height": window.screen.availHeight * .2, "backgroundColor": "#2196f3bd"}}>
                        <h1>FAQ's</h1>
                    </div>
                    <div className="d-flex flex-column align-content-start p-5"
                         style={{"minHeight": window.screen.availHeight * .6, "backgroundColor": "white"}}>
                        {/*<span className="d-flex flex-column align-items-center">*/}
                        {/*/!*<i className="fab fa-facebook-square fa-3x"/>*!/*/}
                        {/*<h4>FaceBook</h4>*/}
                        {/*</span>*/}
                        <Accordion>
                            {this.state.contactData.length > 0 && this.renderPerPageRows()}
                        </Accordion>

                    </div>
                    {/*<div className="d-flex flex-column justify-content-center align-items-center p-0"*/}
                         {/*style={{"height": window.screen.availHeight * .1, "backgroundColor": "#9e9e9e8a"}}>*/}
                        {/*<span>© 2019 zoya.com.bd , All Rights Reserved</span>*/}
                        {/*<span>Dhaka, Bangladesh, (203) 265-4377</span>*/}
                    {/*</div>*/}
                </div>
            </div>
        );
    }
}

export default connect(null, {getFAQs})(Faq);

import React, {Component, Fragment} from 'react';
import ReactLoading from "react-loading";
const initialState = {

};

class OnlinePaymentMethod extends Component {
    constructor(props) {
        super(props);
        this.state = {
            ...initialState
        };
        this.renderPerPageRows = this.renderPerPageRows.bind(this);
    }

    // componentDidMount() {
    //     console.log("RRRRRRRRRRRRRRRRRR",this.props);
    // }

    renderPerPageRows(){
        const list = this.props.sslData.desc;
        return _.map(list, row => {
            return (
                <a key={row.name} target="_blank" href={row.redirectGatewayURL}><img src={row.logo} style={{cursor: 'pointer'}} height={80} width={80} className="rounded mx-auto d-block p-2" alt="amex"/></a>
            )
        });
    }

    render() {
        if (this.props.sslData === null) {
            return <ReactLoading className='relaod-logo-css' type="spinningBubbles" color="#aaaaaa" height={50}
                                 width={50}/>;
        }
        return (
            <Fragment>
                <div>
                    <div className="d-flex justify-content-start mb-4 mt-5">
                    </div>
                </div>
                <div className="card mt-3 mb-3 border-0">
                    <div className="card-header text-center" style={{ background: "#33085ddb", color: "white"}}>
                        <h4>Select Card</h4>
                    </div>
                    <div className="card-body">

                        <div>
                            <div className="d-flex col-md-6 offset-3 justify-content-center flex-wrap">
                                {this.renderPerPageRows()}
                            </div>
                        </div>
                    </div>
                </div>
            </Fragment>
        );
    }
}


export default OnlinePaymentMethod;

import React from 'react';
import { Navbar, NavItem, Nav, MenuItem, NavDropdown, Row, Col } from 'react-bootstrap';
import { connect } from 'react-redux';

//import '../App/App.css';

class Header extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            key: 1,
            disabled: false,
            isloggedin: false,
            user: JSON.parse(localStorage.getItem('user')),
            isManager: false,
            isAdmin: false
        }
        this.handleLogout = this.handleLogout.bind(this);
        this.handleSelect = this.handleSelect.bind(this);
        this.myMarkets = this.myMarkets.bind(this);
        this.myProfile = this.myProfile.bind(this);
    }

    componentWillMount() {
        if (localStorage.getItem('token') === null || localStorage.getItem('token') === "logout") {
            this.setState({
                isloggedin: false
            })
        }
        else {
            this.setState({
                isloggedin: true
            })
            if (this.state.user.managermarketaddresses != null) {

                this.setState({
                    isManager: true
                });
            }
            if (this.state.user.role.toLowerCase() === 'portal admin') {
                this.setState({
                    isAdmin: true
                });
            }
        }
    }

    componentWillReceiveProps(nextProp) {
        this.setState({
            user: nextProp.user
        }, function () {
            if (this.state.user.managermarketaddresses != null) {
                this.setState({
                    isManager: true
                });
            }
        })
    }

    myMarkets() {
        this.props.history.push('/app/mymarkets');
    }

    myProfile() {
        this.props.history.push('/app/registernavigation');
    }

    handleLogout() {
        localStorage.setItem('token', 'logout');
        localStorage.setItem("user", null);
        this.props.history.push('/');
    }


    handleSelect(key) {
        this.setState({ key });
    }

    render() {
        
        return (
                    <div id="page-top">
                        <nav className="navbar navbar-expand-lg custom-nav navbar-light" id="mainNav">
                            <div className="container">
                                
                                <a className="navbar-brand js-scroll-trigger" href="/"> Stellar Network</a>
                                <div className="collapse navbar-collapse" id="navbarResponsive">
                                    <ul className="navbar-nav ml-auto">
                                        <li className="nav-item">
                                        <a className="nav-link js-scroll-trigger" href="/issueAsset">Issue  Asset</a>
                                        </li>
                                        <li className="nav-item">
                                        <a className="nav-link js-scroll-trigger" href="/assetTransactionDetails">Asset Transactions</a>
                                        </li>
                                        <li className="nav-item">
                                        <a className="nav-link js-scroll-trigger" href="/assetRedeem">Redeem Asset</a>
                                        </li>
                                        <li className="nav-item">
                                        <a className="nav-link js-scroll-trigger" href="/#infrastructure">Infrastructure</a>
                                        </li>
                                        <li className="nav-item">
                                        <a className="nav-link js-scroll-trigger" href="/#aboutus">About US</a>
                                        </li>
                                        <li className="nav-item">
                                        <a className="nav-link js-scroll-trigger" href="/#contact">Contact</a>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </nav>
                    </div>
        );
    }
}

function mapStateToProps(state) {
    console.log("In header.jsx : ", state)
    return {
        user: state.user
    };
}


export default connect(mapStateToProps)(Header);
import React from 'react';
import { Route, Switch } from 'react-router-dom';
import {Image,header} from 'react-bootstrap'

// import Login from '../Login/Login';
import Header from '../Header/Header';
import Footer from '../Footer/Footer';
import '../App/App.css';
//import '../../App/App.css';
// import Register from '../Register/Register';
// import Marketplace from '../Marketplace/Marketplace';
class Homepage extends React.Component {

    componentWillMount() {
        if (localStorage.getItem('token') !== null && localStorage.getItem('token') !== "logout") {
            this.props.history.push('/app/dashboard');
        }
    }


    render() {
        return (
                 <div>
                        <header className="masthead" >
                          <div className="container h-100">
                            <div className="row h-100">
                              <div className="col-lg-7 my-auto">
                                <div className="header-content mx-auto">
                                  <h1 className="mb-5">Stellar | Move Money Across Borders Quickly, Reliably, And For A Fraction Of A Penny.</h1>
                                </div>
                              </div>
                            </div>
                          </div>
                        </header>
                    <section className="download bg-primary text-center" id="infrastructure">
                      
                        <div className="row">
                          
                            <Image className="img" src="../MakePayment.png" alt="Sample"/>
                      </div>
                    </section>

                    <section className="features" id="aboutus">
                      <div className="container">
                        <div className="section-heading text-center">
                          <h2>Stellar.org connects people to low-cost financial services to fight poverty and develop individual potential. </h2>
                        </div>
                      </div>
                    </section>

                    <section className="cta">
                      <div className="cta-content">
                        <div className="container">
                          <h2>Stop waiting.<br></br>Start transacting.</h2>
                        </div>
                      </div>
                      <div className="overlay"></div>
                    </section>
                <section className="contact bg-primary" id="contact">
                  <div className="container">
                    <h2>We
                      <i className="fa fa-heart"></i>
                      new customer!</h2>
                    <ul className="list-inline list-social">
                      <li className="list-inline-item social-twitter">
                        <a href="#">
                          <i className="fa fa-twitter"></i>
                        </a>
                      </li>
                      <li className="list-inline-item social-facebook">
                        <a href="#">
                          <i className="fa fa-facebook"></i>
                        </a>
                      </li>
                      <li className="list-inline-item social-google-plus">
                        <a href="#">
                          <i className="fa fa-google-plus"></i>
                        </a>
                      </li>
                    </ul>
                  </div>
                </section>
                </div>
        );

    }
}
export default Homepage;
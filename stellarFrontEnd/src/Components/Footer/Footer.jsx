import React from 'react';
import {Col,Row} from 'react-bootstrap'
//import '../App/App.css';

class Footer extends React.Component{

    render(){
        return(
          <div className="custom-footer">
             <footer>
                <div className="container">
                  <p>&copy; 2018 Stellar Network. All Rights Reserved.</p>
                  <ul className="list-inline">
                    <li className="list-inline-item">
                      <a href="#">Privacy</a>
                    </li>
                    <li className="list-inline-item">
                      <a href="#">Terms</a>
                    </li>
                    <li className="list-inline-item">
                      <a href="#">FAQ</a>
                    </li>
                  </ul>
                </div>
              </footer>
          </div>
        );
    }

}


export default Footer;
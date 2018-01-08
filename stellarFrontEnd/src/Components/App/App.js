import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import './App.css';

import Header from '../Header/Header';
import Footer from '../Footer/Footer';
import Homepage from '../Homepage/Homepage';
import AssetCreation from '../Asset/AssetCreation/AssetCreation';
import IssueAsset from '../Asset/IssueAsset/IssueAsset';
import AssetRedeem from '../Asset/AssetRedeem/AssetRedeem';
import AssetTransactionDetails from '../Asset/AssetTransactionDetails/AssetTransactionDetails';


class App extends Component {

  render() {
    return (
      <div className="App" >
        <Header />
        {/* <header className="App-header">
          <h1 className="App-title">Stellar Term </h1>
        </header> */}
        <Router>
          <Switch>
              <Route exact path="/" component={Homepage} />
              <Route path="/createAsset" component={AssetCreation} />
              <Route path="/issueAsset" component={IssueAsset} />
              <Route path="/assetRedeem" component={AssetRedeem} />
              <Route path="/assetTransactionDetails" component={AssetTransactionDetails} />
              <Route path='*' component={Homepage} />
          </Switch>
        </Router>
        <Footer />
      </div>
    );
  }
}

export default App;

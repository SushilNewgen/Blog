import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import App from './App/App';
import IssueAsset from './Asset/IssueAsset/IssueAsset';
import AssetCreation from './Asset/AssetCreation/AssetCreation';



class routes extends React.Component {

    render() {
        return (
            <Router>
                <Switch>
                    <Route exact path="/" component={App} />
                   
                </Switch>
            </Router>
        );
    }
}

export default routes;
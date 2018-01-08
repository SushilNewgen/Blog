import React from 'react';
import ReactDOM from 'react-dom';
import 'font-awesome/css/font-awesome.min.css';
import './index.css';
import App from './Components/App/App';
// import Routes from './Components/Routes';

import store from '../src/Store/store';
import {Provider} from 'react-redux'


ReactDOM.render(
    <Provider store={store}>
        {/* <Routes /> */}
        <App />
    </Provider>
        , document.getElementById('root'));


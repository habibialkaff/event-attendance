//import 'material-design-lite/material.min.js';
//import 'material-design-lite/material.min.css';
import 'font-awesome/css/font-awesome.css';
import './css/index.scss';


import React from 'react';
import ReactDOM from 'react-dom';
import createBrowserHistory from 'history/lib/createBrowserHistory';
import { Provider } from 'react-redux';
import { Router, Route, IndexRedirect, Redirect} from 'react-router';

import injectTapEventPlugin from 'react-tap-event-plugin';
injectTapEventPlugin();

import configureStore from './store/configureStore';

import App from './containers/App';
import Authorized from './containers/Authorized';
import Home from './containers/Home';
import Login from './containers/Login';
import Admin from './containers/Admin';

const history = createBrowserHistory();
const store = configureStore();

let rootElement = document.getElementById('root');

ReactDOM.render(
    <Provider store={store}>
        <Router history={history}>
            <Route path="/" component={App}>
                <Route path="/login" component={Login}/>
                <Route component={Authorized}>
                    <Route path="/home" component={Home}/>
                    <Route path="/admin" component={Admin}/>
                </Route>
                <IndexRedirect to="/home" />
            </Route>
            <Redirect from="*" to="/home" />
        </Router>
    </Provider>,
    rootElement
);
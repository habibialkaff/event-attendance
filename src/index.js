
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { Router, Route, IndexRedirect, Redirect, browserHistory } from 'react-router';
import injectTapEventPlugin from 'react-tap-event-plugin';

import './css/index.scss';

import configureStore from './store/configureStore';
import App from './containers/App';
import Authorized from './containers/Authorized';
import Home from './containers/Home';
import Login from './containers/Login';
import Admin from './containers/Admin';
import PhoneList from './containers/PhoneList';

injectTapEventPlugin();

const store = configureStore();

const rootElement = document.getElementById('root');

ReactDOM.render(
  <Provider store={store}>
    <Router history={browserHistory}>
      <Route path="/" component={App}>
        <Route path="/login" component={Login} />
        <Route component={Authorized}>
          <Route path="/home" component={Home} />
          <Route path="/admin" component={Admin} />
          <Route path="/phones" component={PhoneList} />
        </Route>
        <IndexRedirect to="/home" />
      </Route>
      <Redirect from="*" to="/home" />
    </Router>
  </Provider>,
  rootElement
);

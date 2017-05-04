import update from 'react-addons-update';
import merge from 'lodash.merge';

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import LightRawTheme from 'material-ui/styles/baseThemes/lightBaseTheme';
import { blueGrey600 } from 'material-ui/styles/colors';

import Header from '../components/Header';

import { checkAuth, logout } from '../actions/auth';

class App extends Component {
  constructor(props) {
    super(props);

    this.handleLogout = this.handleLogout.bind(this);

    this.state = {
      muiTheme: getMuiTheme(LightRawTheme)
    };
  }

  getChildContext() {
    return {
      muiTheme: this.state.muiTheme
    };
  }

  componentWillMount() {
    this.props.checkAuth();

    const newPalette = merge(this.state.muiTheme.baseTheme.palette, { accent1Color: blueGrey600 });
    const muiTheme = getMuiTheme(update(this.state.muiTheme.baseTheme, { palette: { $set: newPalette } }));

    this.setState({ muiTheme });
  }

  handleLogout(e) {
    e.preventDefault();

    this.props.logout();
    this.context.router.push('/login');
  }

  render() {
    return this.props.isAuthChecked ? (
      <div data-layout-fill>
        <div className="header">
          <Header
            isLoggedIn={this.props.isLoggedIn} isSuperUser={this.props.isSuperUser} handleLogout={this.handleLogout} />
        </div>
        <div className="content">
          {this.props.children}
        </div>
        <div style={{ display: this.props.showLoadingSpinner ? '' : 'none' }}>
          <div className="spinner-wrapper">
            <div className="spinner">
              <div className="double-bounce1" />
              <div className="double-bounce2" />
            </div>
          </div>
        </div>
      </div>
    ) : <div>Loading...</div>;
  }
}

App.contextTypes = {
  router: PropTypes.object,
  store: PropTypes.object
};

App.childContextTypes = {
  muiTheme: PropTypes.object
};

App.propTypes = {
  isAuthChecked: PropTypes.bool,
  isLoggedIn: PropTypes.bool,
  isSuperUser: PropTypes.bool,
  showLoadingSpinner: PropTypes.bool,
  children: PropTypes.element,
  checkAuth: PropTypes.func,
  logout: PropTypes.func,
};

function mapStateProps(state) {
  const { auth, event } = state;
  return {
    isAuthChecked: auth.isAuthChecked,
    isLoggedIn: auth.user !== null && auth.user !== undefined,
    isSuperUser: auth.user && auth.user.isSuperUser,
    showLoadingSpinner: event.isUpdating
  };
}

function mapDispatchToProps(dispatch) {
  return {
    checkAuth: () => {
      dispatch(checkAuth());
    },

    logout: () => {
      dispatch(logout());
    }
  };
}

export default connect(mapStateProps, mapDispatchToProps)(App);

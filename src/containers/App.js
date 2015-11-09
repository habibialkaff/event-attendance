import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import Header from '../components/Header';

import {checkAuth, logout} from '../actions/auth';

class App extends Component {
    constructor(props) {
        super(props);
        this.props.dispatch(checkAuth());
    }

    handleLogout = (e) => {
        e.preventDefault();

        this.props.dispatch(logout());
        this.context.history.pushState(null, '/login');
    };

    render() {
        return (
            <div data-layout-fill>
                <div className="header">
                    <Header isLoggedIn={this.props.isLoggedIn} isSuperUser={this.props.isSuperUser} handleLogout={this.handleLogout}/>
                </div>
                <div className="content">
                    {this.props.children}
                </div>
            </div>
        )
    }
}

App.contextTypes = {
    history: PropTypes.object.isRequired,
    store: PropTypes.object.isRequired
};

function mapStateProps(state) {
    let {auth} = state;
    return {
        isLoggedIn: auth.user ? true : false,
        isSuperUser: auth.user && auth.user.isSuperUser
    }
}

export default connect(mapStateProps)(App);
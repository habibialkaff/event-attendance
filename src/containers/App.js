import update from 'react-addons-update';
import merge from 'lodash.merge';

import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import getMuiTheme from 'material-ui/lib/styles/getMuiTheme';
import LightRawTheme from 'material-ui/lib/styles/baseThemes/lightBaseTheme';
import {blueGrey600} from 'material-ui/lib/styles/colors';

import Header from '../components/Header';

import {checkAuth, logout} from '../actions/auth';

class App extends Component {
    constructor(props) {
        super(props);

        this.handleLogout = this.handleLogout.bind(this);

        this.state = {
            muiTheme: getMuiTheme(LightRawTheme)
        };
    }

    handleLogout(e) {
        e.preventDefault();

        this.props.dispatch(logout());        
        this.context.router.push('/login');
    }

    getChildContext() {
        return {
            muiTheme: this.state.muiTheme
        };
    }

    componentWillMount() {
        this.props.dispatch(checkAuth());

        const newPalette = merge(this.state.muiTheme.baseTheme.palette, { accent1Color: blueGrey600 });
        let newMuiTheme = getMuiTheme(update(this.state.muiTheme.baseTheme, { palette: { $set: newPalette } }));

        this.setState({ muiTheme: newMuiTheme });
    }

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
        );
    }
}

App.contextTypes = {
    router: PropTypes.object.isRequired,
    store: PropTypes.object.isRequired
};

App.childContextTypes = {
    muiTheme: React.PropTypes.object
};

App.propTypes = {
    isLoggedIn: React.PropTypes.bool,
    isSuperUser: React.PropTypes.bool
};

function mapStateProps(state) {
    let {auth} = state;
    return {
        isLoggedIn: auth.user ? true : false,
        isSuperUser: auth.user && auth.user.isSuperUser
    };
}

export default connect(mapStateProps)(App);
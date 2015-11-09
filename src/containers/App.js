import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import Header from '../components/Header';

import {checkAuth, logout} from '../actions/auth';

import ThemeManager from 'material-ui/lib/styles/theme-manager';
import LightRawTheme from 'material-ui/lib/styles/raw-themes/light-raw-theme';
import Colors from 'material-ui/lib/styles/colors';

class App extends Component {
    constructor(props) {
        super(props);
        this.props.dispatch(checkAuth());

        this.state = {
            muiTheme: ThemeManager.getMuiTheme(LightRawTheme)
        }
    }

    handleLogout = (e) => {
        e.preventDefault();

        this.props.dispatch(logout());
        this.context.history.pushState(null, '/login');
    };

    getChildContext() {
        return {
            muiTheme: this.state.muiTheme
        };
    }

    componentWillMount() {
        let newMuiTheme = ThemeManager.modifyRawThemePalette(this.state.muiTheme, {
            accent1Color: Colors.purple300
        });

        this.setState({muiTheme: newMuiTheme});
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
        )
    }
}

App.contextTypes = {
    history: PropTypes.object.isRequired,
    store: PropTypes.object.isRequired
};

App.childContextTypes = {
    muiTheme: React.PropTypes.object
};

function mapStateProps(state) {
    let {auth} = state;
    return {
        isLoggedIn: auth.user ? true : false,
        isSuperUser: auth.user && auth.user.isSuperUser
    }
}

export default connect(mapStateProps)(App);
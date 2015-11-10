import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import {Styles} from 'material-ui';

import Header from '../components/Header';

import {checkAuth, logout} from '../actions/auth';

class App extends Component {
    constructor(props) {
        super(props);

        this.state = {
            muiTheme: Styles.ThemeManager.getMuiTheme(Styles.LightRawTheme)
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
        this.props.dispatch(checkAuth());

        let newMuiTheme = Styles.ThemeManager.modifyRawThemePalette(this.state.muiTheme, {
            accent1Color: Styles.Colors.purple300
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
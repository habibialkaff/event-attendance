import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import {login, ssoLogin} from '../actions/auth';
import TextField from 'material-ui/lib/text-field';
import RaisedButton from 'material-ui/lib/raised-button';

class Login extends Component {
    constructor(props) {
        super(props);
    }

    handleLogin = (event) => {
        event.preventDefault();
        let username = this.refs.username;
        let password = this.refs.password;
        this.props.dispatch(login(username.getValue(), password.getValue()));
    };

    handleAdminLogin = (event) => {
        event.preventDefault();
        this.props.dispatch(ssoLogin());
    };

    componentWillMount = () => {
        if (this.props.user) {
            this.props.history.pushState(null, '/');
        }
    };

    componentWillReceiveProps = (nextProps) => {
        if (nextProps.user) {
            this.props.history.pushState(null, '/');
        }
    };

    render() {
        return (
            <div data-layout-fill data-layout="column">
                <div data-flex="70" data-layout="column" data-layout-align="center center">
                    <TextField ref="username" hintText="Username" floatingLabelText="Username"/>
                    <TextField ref="password" hintText="Password" floatingLabelText="Password" type="password"/>

                    <div>
                        <RaisedButton label="LOGIN" primary={true} onClick={this.handleLogin}/>
                    </div>
                </div>
                <div data-flex="20" data-layout="column" data-layout-align="end center">
                    <div data-layout-margin>
                        <RaisedButton label="SUPER USER LOGIN" primary={true} onClick={this.handleAdminLogin}/>
                    </div>
                </div>
            </div>
        )
    }
}

Login.contextTypes = {
    history: PropTypes.object.isRequired,
    store: PropTypes.object.isRequired
};

function mapStateToProps(state) {
    const {auth} = state;
    return {
        user: auth.user,
        loginError: auth.loginError
    };

}

export default connect(mapStateToProps)(Login);
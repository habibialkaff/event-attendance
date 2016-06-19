import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import {login, ssoLogin} from '../actions/auth';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';

class Login extends Component {
  constructor(props) {
    super(props);

    this.handleAdminLogin = this.handleAdminLogin.bind(this);
    this.handleLogin = this.handleLogin.bind(this);
  }

  componentWillMount() {
    if (this.props.user) {
      this.context.router.push('/');
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.user) {
      this.context.router.push('/');
    }
  }

  handleLogin(event) {
    event.preventDefault();
    const username = this.refs.username;
    const password = this.refs.password;
    this.props.dispatch(login(username.getValue(), password.getValue()));
  }

  handleAdminLogin(event) {
    event.preventDefault();
    this.props.dispatch(ssoLogin());
  }

  render() {
    return (
      <div data-layout-fill data-layout="column">
        <div data-flex="70" data-layout="column" data-layout-align="center center">
          <TextField ref="username" hintText="Username" floatingLabelText="Username" />
          <TextField ref="password" hintText="Password" floatingLabelText="Password" type="password" />

          <div>
            <RaisedButton label="LOGIN" primary onClick={this.handleLogin} />
          </div>
          <div>
            <span className="txt-red">{this.props.loginError}</span>
          </div>
        </div>
        <div data-flex="20" data-layout="column" data-layout-align="end center">
          <div data-layout-margin>
            <RaisedButton label="SUPER USER LOGIN" primary onClick={this.handleAdminLogin} />
          </div>
        </div>
      </div>
    );
  }
}

Login.contextTypes = {
  router: PropTypes.object.isRequired,
  store: PropTypes.object.isRequired
};

Login.propTypes = {
  user: PropTypes.object,
  loginError: PropTypes.string
};

function mapStateToProps(state) {
  const {auth} = state;
  return {
    user: auth.user,
    loginError: auth.loginError
  };
}

export default connect(mapStateToProps)(Login);

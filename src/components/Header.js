import React, {Component, PropTypes} from 'react';
import {Link} from 'react-router';

class Header extends Component {
    render() {
        let HomeLink, LoginLink, LogoutLink, AdminLink;

        if (this.props.isLoggedIn) {
            HomeLink =
                <div data-flex data-layout="column" data-layout-align="center center">
                    <Link to="/home">Home</Link>
                </div>;

            LogoutLink =
                <div data-flex data-layout="column" data-layout-align="center center">
                    <Link to="" onClick={this.props.handleLogout}>Logout</Link>
                </div>;

            if (this.props.isSuperUser) {
                AdminLink =
                    <div data-flex data-layout="column" data-layout-align="center center">
                        <Link to="/admin">Admin</Link>
                    </div>;
            }
        }
        else {
            LoginLink =
                <div data-flex data-layout="column" data-layout-align="center center">
                    <Link to="/login">Login</Link>
                </div>;
        }

        return (
            <div data-layout-fill data-layout="row">
                {HomeLink}
                {AdminLink}
                {LoginLink}
                {LogoutLink}
            </div>
        );
    }
}

Header.propTypes = {
    isLoggedIn: PropTypes.bool,
    isSuperUser: PropTypes.bool,
    handleLogout: PropTypes.func    
};

export default Header;
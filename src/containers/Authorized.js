import {Component, PropTypes} from 'react';
import {connect} from 'react-redux';

class Authorized extends Component {
    componentWillMount() {
        let {user} = this.props;
        if (!user) {
            this.context.router.replace('/login');
        }
    }

    render() {
        return this.props.children;
    }
}

Authorized.contextTypes = {
    router: PropTypes.object.isRequired
};

Authorized.propTypes = {
    user: PropTypes.object
};

function mapStateToProps(state) {
    return {user: state.auth.user};
}

export default connect(mapStateToProps)(Authorized);
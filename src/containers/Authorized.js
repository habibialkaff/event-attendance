import {Component} from 'react';
import {connect} from 'react-redux';

class Authorized extends Component {
    componentWillMount() {
        let {history, user} = this.props;
        if (!user) {
            history.replaceState(null, '/login');
        }
    }

    render() {
        return this.props.children;
    }
}

function mapStateToProps(state) {
    return {user: state.auth.user};
}

export default connect(mapStateToProps)(Authorized);
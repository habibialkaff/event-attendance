import React, {Component, PropTypes} from 'react';
import {isObjectChanged} from '../../helpers/isObjectChanged';

class AttendanceDetail extends Component {
  shouldComponentUpdate(nextProps) {
    return isObjectChanged(this.props.member, nextProps.member);
  }

  render() {
    return (
      <div data-flex="60" data-layout="column" data-layout-align="center start">
        <div data-hide-sm data-flex data-layout="row" data-layout-fill>
          <div data-flex="80" data-layout="column" data-layout-align="center start">
            {this.props.member && this.props.member.name.toUpperCase() }
          </div>
          <div data-flex="20" data-layout="column" data-layout-align="center center">
            {this.props.member && this.props.member.phone}
          </div>
        </div>
        <div data-hide-gt-sm data-layout="column">
          <div>
            {this.props.member && this.props.member.name.toUpperCase() }
          </div>
          <div className="txt-gray">{this.props.member && this.props.member.phone}</div>
        </div>
      </div>
    );
  }
}

AttendanceDetail.propTypes = {
  member: PropTypes.object
};

export default AttendanceDetail;

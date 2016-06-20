import React, {Component, PropTypes} from 'react';
import AttendanceEditButton from './AttendanceEditButton';
import AttendanceCheckbox from './AttendanceCheckbox';

class Attendance extends Component {
  constructor(props) {
    super(props);

    this.editMember = this.editMember.bind(this);
    this.setAttendance = this.setAttendance.bind(this);
  }

  shouldComponentUpdate(nextProps) {
    return (nextProps.isAttended || false) !== (this.props.isAttended || false) ||
      nextProps.member !== this.props.member;
  }

  setAttendance(e, flag) {
    this.props.setAttendance(this.props.member.uid, flag);
  }

  editMember() {
    this.props.editMember(this.props.member);
  }

  render() {
    const isHidden = this.props.member === null || this.props.member === undefined;
    return (
      <div data-layout="row" style={{ display: isHidden ? 'none' : '' }}>
        <AttendanceEditButton editMember={this.editMember} />
        <AttendanceCheckbox isAttended={this.props.isAttended} setAttendance={this.setAttendance} />
        <div data-flex="60" data-flex-order="2" data-layout="column" data-layout-align="center start">
          <div data-hide-sm data-layout="row" data-layout-fill>
            <div
              data-flex="80" data-layout="column"
              data-layout-align="center start">{!isHidden && this.props.member.name.toUpperCase() }</div>
            <div
              data-flex="20" data-layout="column"
              data-layout-align="center center">{!isHidden && this.props.member.phone}</div>
          </div>
          <div data-hide-gt-sm data-layout="column">
            <div>{!isHidden && this.props.member.name.toUpperCase() }</div>
            <div className="txt-gray">{!isHidden && this.props.member.phone}</div>
          </div>
        </div>
      </div>
    );
  }
}

Attendance.propTypes = {
  isAttended: PropTypes.bool,
  member: PropTypes.object,
  setAttendance: PropTypes.func,
  editMember: PropTypes.func
};

export default Attendance;

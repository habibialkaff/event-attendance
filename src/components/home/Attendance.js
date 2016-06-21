import React, {Component, PropTypes} from 'react';
import AttendanceEditButton from './AttendanceEditButton';
import AttendanceCheckbox from './AttendanceCheckbox';
import AttendanceDetail from './AttendanceDetail';
import {isObjectChanged} from '../../helpers/isObjectChanged';

class Attendance extends Component {
  constructor(props) {
    super(props);

    this.editMember = this.editMember.bind(this);
    this.setAttendance = this.setAttendance.bind(this);
  }

  shouldComponentUpdate(nextProps) {
    return (nextProps.isAttended || false) !== (this.props.isAttended || false) ||
      isObjectChanged(this.props.member, nextProps.member);
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
        <AttendanceDetail member={this.props.member} />
        <AttendanceCheckbox isAttended={this.props.isAttended} setAttendance={this.setAttendance} />
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

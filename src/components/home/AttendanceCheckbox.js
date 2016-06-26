import React, {Component, PropTypes} from 'react';
import Checkbox from 'material-ui/Checkbox';

class AttendanceCheckbox extends Component {
  shouldComponentUpdate(nextProps) {
    return (nextProps.isAttended || false) !== (this.props.isAttended || false);
  }

  render() {
    return (
      <div data-flex="20" data-layout="column" data-layout-align="center center">
        <div>
          <Checkbox
            inputStyle={{ WebkitTapHighlightColor: 'rgba(0,0,0,0)' }}
            defaultChecked={this.props.isAttended} onCheck={this.props.setAttendance} />
        </div>
      </div>
    );
  }
}

AttendanceCheckbox.propTypes = {
  setAttendance: PropTypes.func,
  isAttended: PropTypes.bool
};

export default AttendanceCheckbox;

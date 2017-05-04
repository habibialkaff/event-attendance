import React, { Component } from 'react';
import PropTypes from 'prop-types';
import FlatButton from 'material-ui/FlatButton';

class AttendanceEditButton extends Component {
  shouldComponentUpdate() {
    return false;
  }

  render() {
    return (
      <div data-flex="20" data-layout="column" data-layout-align="center center">
        <FlatButton
          label="EDIT" primary
          onClick={this.props.editMember}
          style={{ 'minWidth': '0px' }} />
      </div>
    );
  }
}

AttendanceEditButton.propTypes = {
  editMember: PropTypes.func,
};

export default AttendanceEditButton;

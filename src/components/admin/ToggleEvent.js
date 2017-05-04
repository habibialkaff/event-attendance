import React from 'react';
import PropTypes from 'prop-types';
import Toggle from 'material-ui/Toggle';

export const ToggleEvent = (props) => {
  function toggleEvent() {
    props.toggleEvent(props.eventKey);
  }

  return (
    <Toggle toggled={props.toggled} onToggle={toggleEvent} />
  );
};

ToggleEvent.propTypes = {
  toggleEvent: PropTypes.func,
  toggled: PropTypes.bool,
  eventKey: PropTypes.string
};

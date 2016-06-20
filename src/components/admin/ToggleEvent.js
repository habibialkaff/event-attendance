import React from 'react';
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
  toggleEvent: React.PropTypes.func,
  toggled: React.PropTypes.bool,
  eventKey: React.PropTypes.string
};

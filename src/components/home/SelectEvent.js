import React from 'react';
import PropTypes from 'prop-types';
import RaisedButton from 'material-ui/RaisedButton';

export const SelectEvent = (props) => {
  function selectEvent() {
    props.selectEvent(props.eventKey);
  }

  return (
    <div data-flex data-layout="column" data-layout-margin>
      <RaisedButton primary label={props.eventName} onClick={selectEvent} />
    </div>
  );
};

SelectEvent.propTypes = {
  eventKey: PropTypes.string,
  eventName: PropTypes.string,
  selectEvent: PropTypes.func
};

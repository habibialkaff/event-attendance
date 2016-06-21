import React from 'react';
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
  eventKey: React.PropTypes.string,
  eventName: React.PropTypes.string,
  selectEvent: React.PropTypes.func
};

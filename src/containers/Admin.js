import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { attachLoadEvents, detachLoadEvents, update } from '../actions/event';

import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import { List, ListItem } from 'material-ui/List';

import { ToggleEvent } from '../components/admin/ToggleEvent';

class Admin extends Component {
  constructor(props) {
    super(props);

    this.editEvent = this.editEvent.bind(this);
    this.saveEvent = this.saveEvent.bind(this);
    this.cancelSaveEvent = this.cancelSaveEvent.bind(this);
    this.toggleEvent = this.toggleEvent.bind(this);
    this.onChangeEventName = this.onChangeEventName.bind(this);


    this.state = {
      isEditEvent: false,
      eventName: ''
    };
  }

  componentWillMount() {
    this.props.attachLoadEvents();
  }

  componentWillUnmount() {
    this.props.detachLoadEvents();
  }

  onChangeEventName(e) {
    this.setState({
      eventName: e.target.value
    });
  }

  editEvent() {
    this.setState({
      isEditEvent: true
    });
  }

  saveEvent(e) {
    e.preventDefault();

    const name = this.state.eventName;

    if (name) {
      const event = {
        name,
        description: null,
        isClosed: false
      };

      this.props.update(event);
    }

    this.setState({
      isEditEvent: false,
      eventName: ''
    });
  }

  cancelSaveEvent(e) {
    e.preventDefault();

    this.setState({
      isEditEvent: false,
      eventName: ''
    });
  }

  toggleEvent(key) {
    const event = this.props.events[key];

    event.isClosed = !event.isClosed;
    this.props.update(event, key);
  }

  render() {
    let eventEdit;

    if (this.state.isEditEvent) {
      eventEdit = (<div data-layout="column" data-layout-align="center center">
        <div className="edit-event">
          <TextField
            value={this.state.eventName} onChange={this.onChangeEventName}
            hintText="Event Name" floatingLabelText="Event Name" />

          <div data-layout="row" data-layout-align="space-between center">
            <RaisedButton label="SAVE EVENT" primary onClick={this.saveEvent} />
            <RaisedButton label="CANCEL" secondary onClick={this.cancelSaveEvent} />
          </div>
        </div>
      </div>);
    } else {
      eventEdit = (<div data-layout="column" data-layout-align="center center" data-layout-margin>
        <RaisedButton label="ADD EVENT" primary onClick={this.editEvent} />
      </div>);
    }

    const listItemStyle = {
      'fontSize': '1.5em'
    };

    return (
      <div>
        {eventEdit}
        <div>
          <List>
            {
              Object.keys(this.props.events).map((key, i) => {
                const event = this.props.events[key];
                if (!event.isClosed) {
                  const rightToggle = (
                    <ToggleEvent eventKey={key} toggled={!event.isClosed} toggleEvent={this.toggleEvent} />
                  );

                  return (
                    <ListItem
                      key={i}
                      primaryText={<div style={listItemStyle}>{event.name}</div>}
                      rightToggle={rightToggle}
                      secondaryText={
                        <p>
                          <span>
                            Username: {event.admin.email}
                          </span>
                          <br />
                          <span>
                            Password: {event.admin.password}
                          </span>
                        </p>
                      } secondaryTextLines={2} />
                  );
                }

                return null;
              })
            }
            {
              Object.keys(this.props.events).map((key, i) => {
                const event = this.props.events[key];
                if (event.isClosed) {
                  const rightToggle = (
                    <ToggleEvent eventKey={key} toggled={!event.isClosed} toggleEvent={this.toggleEvent} />
                  );

                  return (
                    <ListItem
                      key={i} primaryText={<div style={listItemStyle}>{event.name}</div>}
                      rightToggle={rightToggle} />
                  );
                }

                return null;
              })
            }
          </List>
        </div>
      </div>
    );
  }
}

Admin.propTypes = {
  events: PropTypes.object,
  attachLoadEvents: PropTypes.func,
  detachLoadEvents: PropTypes.func,
  update: PropTypes.func
};

function mapStateToProps(state) {
  const { event } = state;

  const events = event.events || {};

  return {
    events
  };
}

function mapDispatchToProps(dispatch) {
  return {
    attachLoadEvents: () => {
      dispatch(attachLoadEvents());
    },
    detachLoadEvents: () => {
      dispatch(detachLoadEvents());
    },
    update: (event, key) => {
      dispatch(update(event, key));
    }
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Admin);

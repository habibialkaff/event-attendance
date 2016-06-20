import React, {Component} from 'react';
import {connect} from 'react-redux';
import {attachLoadEvents, detachLoadEvents, update} from '../actions/event';

import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import {List, ListItem} from 'material-ui/List';

import {ToggleEvent} from '../components/admin/ToggleEvent';

class Admin extends Component {
  constructor(props) {
    super(props);

    this.editEvent = this.editEvent.bind(this);
    this.saveEvent = this.saveEvent.bind(this);
    this.cancelSaveEvent = this.cancelSaveEvent.bind(this);
    this.toggleEvent = this.toggleEvent.bind(this);


    this.state = {
      isEditEvent: false
    };
  }

  componentWillMount() {
    this.props.attachLoadEvents();
  }

  componentWillUnmount() {
    this.props.detachLoadEvents();
  }

  editEvent() {
    this.setState({
      isEditEvent: true
    });
  }

  saveEvent(e) {
    e.preventDefault();

    const name = this.refs.eventName.getValue();

    if (name) {
      const event = {
        name,
        description: null,
        isClosed: false
      };

      this.props.update(event);
    }

    this.setState({
      isEditEvent: false
    });

    this.refs.eventName.setValue('');
  }

  cancelSaveEvent(e) {
    e.preventDefault();

    this.setState({
      isEditEvent: false
    });

    this.refs.eventName.setValue('');
  }

  toggleEvent(key, e) {
    e.preventDefault();

    const event = this.props.events[key];

    event.isClosed = !event.isClosed;
    this.props.update(event, key);
  }

  render() {
    let eventEdit;

    if (this.state.isEditEvent) {
      eventEdit = (<div data-layout="column" data-layout-align="center center">
        <div className="edit-event">
          <TextField ref="eventName" hintText="Event Name" floatingLabelText="Event Name" />

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

    let listItemStyle = {
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
                    <ToggleEvent eventKey={key} toggled={!event.isClosed} onToggle={this.toggleEvent} />
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
                    <ToggleEvent eventKey={key} toggled={!event.isClosed} onToggle={this.toggleEvent} />
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
  events: React.PropTypes.object,
  attachLoadEvents: React.PropTypes.func,
  detachLoadEvents: React.PropTypes.func,
  update: React.PropTypes.func
};

function mapStateToProps(state) {
  const { event} = state;

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
    update: (event) => {
      dispatch(update(event));
    }
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Admin);

import React, {Component, PropTypes} from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';

import EditMember from '../components/home/EditMember';
import Search from '../components/home/Search';
import {SelectEvent} from '../components/home/SelectEvent';

import {connect} from 'react-redux';
import {loadOpenEvents, updateAttendance, attachEventAttendance, detachEventAttendance} from '../actions/event';
import {attachLoadMembers, detachLoadMembers, updateMember} from '../actions/member';

class Home extends Component {
  constructor(props) {
    super(props);
    this.selectEvent = this.selectEvent.bind(this);
    this.addMember = this.addMember.bind(this);
    this.editMember = this.editMember.bind(this);
    this.cancelEditMember = this.cancelEditMember.bind(this);
    this.saveMember = this.saveMember.bind(this);
    this.setAttendance = this.setAttendance.bind(this);
    this.closeDialog = this.closeDialog.bind(this);
    this.onSearchInputChange = this.onSearchInputChange.bind(this);

    this.memberKeys = null;
    this.searchInputValue = '';

    this.state = {
      selectedEvent: null,
      selectedMember: null,
      showEditMember: false,
      showMemberSavedDialog: false,
      searchInputValue: ''
    };
  }

  componentDidMount() {
    this.props.dispatch(loadOpenEvents(this.props.eventUid));
    this.props.dispatch(attachLoadMembers());
  }

  componentWillReceiveProps(nextProps) {
    if (!this.state.selectedEvent) {
      const keys = Object.keys(nextProps.events);

      if (keys.length === 1) {
        const key = keys[0];
        this.setState({
          selectedEvent: nextProps.events[key],
          selectedEventUid: key
        });

        this.props.dispatch(attachEventAttendance(key));
      }
    }
  }

  componentDidUpdate(prevProps) {
    if (this.props.updatedMemberUid !== prevProps.updatedMemberUid) {
      this.props.dispatch(updateAttendance(this.props.updatedMemberUid, this.state.selectedEventUid, true));
    }

    if (this.props.members !== prevProps.members) {
      this.memberKeys = Object.keys(this.props.members);
    }
  }

  componentWillUnmount() {
    this.props.dispatch(detachLoadMembers());

    if (this.state.selectedEventUid) {
      this.props.dispatch(detachEventAttendance(this.state.selectedEventUid));
    }
  }

  onSearchInputChange(value) {
    this.searchInputValue = value;
  }

  setAttendance(memberUid, isAttended) {
    this.props.dispatch(updateAttendance(memberUid, this.state.selectedEventUid, isAttended));
  }

  selectEvent(key) {
    this.setState({
      selectedEvent: this.props.events[key],
      selectedEventUid: key
    });

    this.props.dispatch(attachEventAttendance(key));
  }

  addMember() {
    this.setState({
      selectedMember: null,
      showEditMember: true,
      searchInputValue: this.searchInputValue
    });
  }

  editMember(member) {
    this.setState({
      selectedMember: member,
      showEditMember: true,
      searchInputValue: this.searchInputValue
    });
  }

  cancelEditMember() {
    this.setState({
      showEditMember: false
    });
  }

  saveMember(member, uid) {
    this.props.dispatch(updateMember(member, uid));

    this.setState({
      showEditMember: false,
      showMemberSavedDialog: true
    });

    window.setTimeout(() => {
      this.closeDialog();
    }, 2000);
  }

  closeDialog() {
    this.setState({
      showMemberSavedDialog: false
    });
  }

  render() {
    let content = null;

    if (!this.state.selectedEvent && Object.keys(this.props.events).length === 0) {
      return <div>Loading...</div>;
    }

    if (!this.state.selectedEvent) {
      const events = this.props.events || {};
      const keys = Object.keys(events);

      if (keys.length > 1) {
        content =
          (<div>
            <h2>Select Event: </h2>
            <div>
              {
                keys.map((key, i) => {
                  return (
                    <SelectEvent key={i} eventKey={key} eventName={events[key].name} selectEvent={this.selectEvent} />
                  );
                })
              }
            </div>
          </div>);
      }
    } else {
      let attended = 0;
      Object.keys(this.props.attendances).forEach((key) => {
        if (this.props.attendances[key]) {
          attended++;
        }
      });

      content = (
        <div>
          <h3 style={{ margin: 0 }}>
            <span className="color-1">{`${this.state.selectedEvent.name} - ${attended}`}</span>
          </h3>
          <div data-layout-padding data-layout="row" data-layout-align="center center" data-layout-fill>
            <RaisedButton label="ADD NEW" primary onClick={this.addMember} style={{ width: '100%' }} />
          </div>
          <Search
            members={this.props.members} attendances={this.props.attendances}
            setAttendance={this.setAttendance} editMember={this.editMember}
            onSearchInputChange={this.onSearchInputChange} />
        </div>
      );
    }

    const actions = [
      <FlatButton label="Ok" onTouchTap={this.closeDialog} />
    ];

    return (
      <div data-layout-margin>
        {content}
        <EditMember
          showEditMember={this.state.showEditMember} selectedMember={this.state.selectedMember}
          searchInputValue={this.state.searchInputValue} saveMember={this.saveMember}
          onCancel={this.cancelEditMember} />
        <Dialog open={this.state.showMemberSavedDialog} actions={actions} modal>
          <span>Member is updated and set to Attended</span>
        </Dialog>
      </div>
    );
  }
}

Home.propTypes = {
  eventUid: PropTypes.string,
  events: PropTypes.object,
  members: PropTypes.object,
  attendances: PropTypes.object,
  updatedMemberUid: PropTypes.string,
  dispatch: PropTypes.func
};

function mapStateToProps(state) {
  const {auth, event, member} = state;

  return {
    eventUid: auth.user ? auth.user.eventUid : null,
    events: event.openedEvents || {},
    members: member.members,
    attendances: event.attendances || {},
    updatedMemberUid: member.memberUid
  };
}

export default connect(mapStateToProps)(Home);

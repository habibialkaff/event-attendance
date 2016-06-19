import React, {Component, PropTypes} from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';

import EditMember from '../components/home/EditMember';
import Search from '../components/home/Search';

import {connect} from 'react-redux';
import {loadOpenEvents, updateAttendance, attachEventAttendance, detachEventAttendance} from '../actions/event';
import {attachLoadMembers, detachLoadMembers, updateMember} from '../actions/member';

class Home extends Component {
  constructor(props) {
    super(props);
    this.selectEvent = this.selectEvent.bind(this);
    this.editMember = this.editMember.bind(this);
    this.cancelEditMember = this.cancelEditMember.bind(this);
    this.saveMember = this.saveMember.bind(this);
    this.setAttendance = this.setAttendance.bind(this);
    this.closeDialog = this.closeDialog.bind(this);

    this.memberKeys = null;

    this.state = {
      selectedEvent: null,
      selectedMember: null,
      searchInputValue: '',
      showEditMember: false,
      showMemberSavedDialog: false
    };
  }

  componentDidMount() {
    this.props.dispatch(loadOpenEvents(this.props.eventUid));
    this.props.dispatch(attachLoadMembers());
  }

  componentWillReceiveProps() {
    if (!this.state.selectedEvent) {
      const keys = Object.keys(this.props.events);

      if (keys.length === 1) {
        this.selectEvent(keys[0]);
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

  editMember(member) {
    this.setState({
      selectedMember: member,
      showEditMember: true
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
    console.log('test');
    let content = null;

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
                    <div data-flex data-layout="column" key={i} data-layout-margin>
                      <RaisedButton
                        label={events[key].name} primary
                        onClick={this.selectEvent.bind(this, key) } />
                    </div>
                  );
                })
              }
            </div>
          </div>);
      }
    } else {
      content = (
        <div>
          <h3 style={{ margin: 0 }}>
            <span className="color-1">{this.state.selectedEvent.name}</span>
          </h3>
          <div data-layout-padding data-layout="row" data-layout-align="center center" data-layout-fill>
            <RaisedButton label="ADD NEW" primary onClick={this.editMember } style={{ width: '100%' }} />
          </div>
          <Search
            members={this.props.members} attendances={this.props.attendances}
            setAttendance={this.setAttendance} editMember={this.editMember} />
        </div>
      );
    }

    const actions = [
      <FlatButton label="Ok" onTouchTap={this.closeDialog} />
    ];

    return content !== null ? (
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
    ) : <div>Loading...</div>;
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

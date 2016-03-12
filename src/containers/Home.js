import React, {Component, PropTypes} from 'react';
import RaisedButton from 'material-ui/lib/raised-button';
import TextField from 'material-ui/lib/text-field';
import Dialog from 'material-ui/lib/dialog';
import FlatButton from 'material-ui/lib/flat-button';
import keycode from 'keycode';
import debounce from 'lodash.debounce';

import Attendance from '../components/Attendance';
import EditMember from '../components/EditMember';

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
        this.onSearchEnter = this.onSearchEnter.bind(this);
        this.closeDialog = this.closeDialog.bind(this);
        this.onChange_SearchText = this.onChange_SearchText.bind(this);
        this.updateSearchResult = debounce(this.updateSearchResult.bind(this), 500);

        this.memberKeys = null;

        this.state = {
            selectedEvent: null,
            filteredMembers: [],
            selectedMember: null,
            searchInputValue: '',
            showEditMember: false,
            showMemberSavedDialog: false
        };
    }

    onChange_SearchText(e) {
        this.setState({
            searchInputValue: e.target.value
        });
        
        this.updateSearchResult();
    }

    updateSearchResult() {
        let inputValue = this.state.searchInputValue;

        let val = inputValue.toLowerCase();
        let arr = [];

        if (!this.memberKeys) {
            this.memberKeys = Object.keys(this.props.members);
        }

        if (val) {
            let count = 0;

            this.memberKeys.some((key) => {
                if (count > 50) {
                    return true;
                }

                if (key.toLowerCase().indexOf(val) > -1) {
                    let items = this.props.members[key];
                    arr.push(...items);
                    count += items.length;
                }
            });
        }

        this.setState({
            filteredMembers: arr
        });
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

    setAttendance(memberUid, isAttended) {
        this.props.dispatch(updateAttendance(memberUid, this.state.selectedEventUid, isAttended));
    }

    closeDialog() {
        this.setState({
            showMemberSavedDialog: false
        });
    }

    onSearchEnter(event) {
        if (keycode(event) === 'enter' && this.state.filteredMembers.length === 1) {
            this.setAttendance(this.state.filteredMembers[0].uid, true);
        }
    }

    componentDidMount() {
        this.props.dispatch(loadOpenEvents(this.props.eventUid));
        this.props.dispatch(attachLoadMembers());
    }

    componentWillUnmount() {
        this.props.dispatch(detachLoadMembers());

        if (this.state.selectedEventUid) {
            this.props.dispatch(detachEventAttendance(this.state.selectedEventUid));
        }
    }

    componentWillReceiveProps() {
        if (!this.state.selectedEvent) {
            let keys = Object.keys(this.props.events);

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

    render() {
        let content = null;

        if (!this.state.selectedEvent) {
            let events = this.props.events || {};
            let keys = Object.keys(events);

            if (keys.length > 1) {
                content =
                    <div>
                        <h2>Select Event: </h2>

                        <div>
                            {
                                keys.map((key, i) => {
                                    return (
                                        <div data-flex data-layout="column" key={i} data-layout-margin>
                                            <RaisedButton label={events[key].name} primary={true}
                                                onClick={this.selectEvent.bind(this, key) }/>
                                        </div>
                                    );
                                })
                            }
                        </div>
                    </div>;
            }
        }
        else {
            let searchResult =
                <div>
                    <div data-layout-margin>
                        <RaisedButton label="ADD NEW" primary={true} onClick={this.editMember.bind(this, null) }
                            fullWidth={true} labelStyle={{ 'fontSize': '1.2em' }}/>
                    </div>
                    <div>
                        {this.state.filteredMembers.map((member, i) => {
                            return (<Attendance key={i} member={member}
                                isAttended={this.props.attendances[member.uid] ? true : false}
                                setAttendance={this.setAttendance} editMember={this.editMember}/>);
                        }) }
                    </div>
                </div>;

            content =
                <div>
                    <h3 style={{ margin: 0 }}>
                        <span className="color-1">{this.state.selectedEvent.name}</span>
                    </h3>

                    <div>
                        <TextField hintText="" floatingLabelText="Search User" fullWidth={true}
                            onChange={this.onChange_SearchText} onKeyDown={this.onSearchEnter}/>
                    </div>
                    {searchResult}
                </div>;
        }

        const editMember =
            <EditMember showEditMember={this.state.showEditMember} selectedMember={this.state.selectedMember}
                searchInputValue={this.state.searchInputValue} saveMember={this.saveMember}
                onCancel={this.cancelEditMember}/>;

        const actions = [
            <FlatButton label="Ok" onTouchTap={this.closeDialog}/>
        ];

        return (
            <div data-layout-margin>
                {content}
                {editMember}
                <Dialog open={this.state.showMemberSavedDialog} actions={actions} modal={true}>
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
    updatedMemberUid: PropTypes.string
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
import React, {Component, PropTypes} from 'react';
import * as _ from 'lodash';
import {RaisedButton, TextField, Dialog} from 'material-ui';

import Attendance from '../components/Attendance';

import {connect} from 'react-redux';
import {loadOpenEvents, updateAttendance, attachEventAttendance, detachEventAttendance} from '../actions/event';
import {loadMembers, updateMember} from '../actions/member';

class Home extends Component {
    constructor(props) {
        super(props);

        this.selectEvent = this.selectEvent.bind(this);
        this.editMember = this.editMember.bind(this);
        this.onDialogShown = this.onDialogShown.bind(this);
        this.saveMember = this.saveMember.bind(this);
        this.setAttendance = this.setAttendance.bind(this);
        this.updateSearchResult = _.debounce(this.updateSearchResult.bind(this), 200);


        this.memberKeys = null;

        this.state = {
            selectedEvent: null,
            filteredMembers: [],
            selectedMember: null
        }
    }

    componentDidMount() {
        this.props.dispatch(loadOpenEvents(this.props.eventUid));
        this.props.dispatch(loadMembers());
    }

    componentWillUnmount() {
        if (this.state.selectedEventUid) {
            this.props.dispatch(detachEventAttendance(this.state.selectedEventUid));
        }
    }

    componentWillUpdate() {
        if (!this.state.selectedEvent) {
            let keys = Object.keys(this.props.events);

            if (keys.length === 1) {
                this.selectEvent(keys[0]);
            }
        }
    }

    componentDidUpdate(prevProps) {
        if (this.props.updatedMemberUid !== prevProps.updatedMemberUid) {
            this.props.dispatch(updateAttendance(this.props.updatedMemberUid, this.state.selectedEventUid, true))
        }
    }

    setAttendance(memberUid, isAttended) {
        this.props.dispatch(updateAttendance(memberUid, this.state.selectedEventUid, isAttended))
    }

    selectEvent(key) {
        this.setState({
            selectedEvent: this.props.events[key],
            selectedEventUid: key
        });

        this.props.dispatch(attachEventAttendance(key))
    }

    editMember(member) {
        this.setState({
            selectedMember: member
        });

        this.refs.dialog.show();
    }

    onDialogShown() {
        let nameValue = '';
        let phoneValue = '';

        if (this.state.selectedMember) {
            nameValue = this.state.selectedMember.name;
            phoneValue = this.state.selectedMember.phone;
        }
        else {
            nameValue = this.refs.searchInput.getValue();
        }

        this.refs.editNameInput.setValue(nameValue);
        this.refs.editPhoneInput.setValue(phoneValue);
    }

    onSearchEnter() {
        if (this.state.filteredMembers.length === 1) {
            this.setAttendance(this.state.filteredMembers[0].uid, true);
        }
    }

    saveMember() {
        let member = {
            name: this.refs.editNameInput.getValue(),
            phone: this.refs.editPhoneInput.getValue()
        };

        let uid = this.state.selectedMember ? this.state.selectedMember.uid : null

        this.props.dispatch(updateMember(member, uid));

        this.refs.dialog.dismiss();
    }

    updateSearchResult(e) {
        let val = e.target.value.toLowerCase();
        let arr = [];

        if (!this.memberKeys) {
            this.memberKeys = Object.keys(this.props.members);
        }

        if (val) {
            let count = 0;

            this.memberKeys.some((key) => {
                if (count > 20) {
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
        })
    }

    render() {
        let content = null;

        if (!this.state.selectedEvent) {
            let events = this.props.events || {};
            let keys = Object.keys(events);

            if (keys.length > 1) {
                content =
                    <div>
                        <h2>Select Event:</h2>

                        <div>
                            {
                                keys.map((key, i) => {
                                    return (
                                        <div data-flex data-layout="column" key={i} data-layout-margin>
                                            <RaisedButton label={events[key].name} primary={true}
                                                          onClick={this.selectEvent.bind(this, key)}/>
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
                        <RaisedButton label="Add NEW" primary={true} onClick={this.editMember.bind(this, null)}
                                      fullWidth={true} labelStyle={{'fontSize': '1.2em'}}/>
                    </div>
                    <div>
                        {this.state.filteredMembers.map((member, i) => {
                            return (<Attendance key={i} member={member}
                                                isAttended={this.props.attendances[member.uid] ? true : false}
                                                setAttendance={this.setAttendance} editMember={this.editMember}/>);
                        })}
                    </div>
                </div>;

            content =
                <div>
                    <h3 style={{margin: 0}}>
                        <span className="color-1">{this.state.selectedEvent.name}</span>
                    </h3>

                    <div>
                        <TextField ref="searchInput" hintText="" floatingLabelText="Search User" fullWidth={true}
                                   onChange={this.updateSearchResult} onEnterKeyDown={this.onSearchEnter}/>
                    </div>
                    {searchResult}
                </div>;
        }

        let standardActions = [
            {text: 'Cancel'},
            {text: 'Save', ref: 'submit', onTouchTap: this.saveMember}
        ];

        let dialogContainer =
            <Dialog ref="dialog" actions={standardActions} actionFocus="submit" onShow={this.onDialogShown}
                    modal={true}>
                <TextField ref="editNameInput" hintText="" floatingLabelText="Name" fullWidth={true}/>
                <TextField ref="editPhoneInput" type="tel" hintText="" floatingLabelText="Phone Number"
                           fullWidth={true}/>
            </Dialog>;

        return (
            <div data-layout-margin>
                {content}
                {dialogContainer}
            </div>
        )
    }
}

function mapStateToProps(state) {
    const {auth, event, member} = state;

    return {
        eventUid: auth.user ? auth.user.eventUid : null,
        events: event.openedEvents || {},
        members: member.members,
        attendances: event.attendances,
        updatedMemberUid: member.memberUid
    };
}

export default connect(mapStateToProps)(Home);
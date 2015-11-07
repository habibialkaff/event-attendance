import React, {Component, PropTypes} from 'react';
import {FlatButton, Toggle} from 'material-ui';


class Attendance extends Component {
    constructor(props) {
        super(props);

        this.editMember = this.editMember.bind(this);
        this.setAttendance = this.setAttendance.bind(this);
    }

    editMember() {
        this.props.editMember(this.props.member);
    }

    setAttendance() {
        this.props.setAttendance(this.props.member.uid, this.refs.toggle.isToggled());
    }

    render() {
        return (
            <div data-layout="row">
                <div data-flex="20" data-layout="column" data-layout-align="center center">
                    <FlatButton label="EDIT" primary={true}
                                onClick={this.editMember}
                                style={{'minWidth': '0px'}}/>
                </div>
                <div data-flex="60" data-layout="column" data-layout-align="center start">
                    <div data-hide-sm data-layout="row" data-layout-fill>
                        <div data-flex="80" data-layout="column"
                             data-layout-align="center start">{this.props.member.name.toUpperCase()}</div>
                        <div data-flex="20" data-layout="column"
                             data-layout-align="center center">{this.props.member.phone}</div>
                    </div>
                    <div data-hide-gt-sm data-layout="column">
                        <div>{this.props.member.name.toUpperCase()}</div>
                        <div className="txt-gray">{this.props.member.phone}</div>
                    </div>
                </div>
                <div data-flex="20" data-layout="column" data-layout-align="center center">
                    <div >
                        <Toggle ref="toggle" defaultToggled={this.props.isAttended}
                                onToggle={this.setAttendance}/>
                    </div>
                </div>
            </div>
        )
    }
}

export default Attendance;
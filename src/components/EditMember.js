import React, {Component, PropTypes} from 'react';
import {FlatButton, Toggle} from 'material-ui';

class EditMember extends Component {
    constructor(props) {
        super(props);

        this.onDialogShown = this.onDialogShown.bind(this);
        this.saveMember = this.saveMember.bind(this);

        this.standardActions = [
            {text: 'Cancel'},
            {text: 'Save', ref: 'submit', onTouchTap: this.saveMember}
        ];
    }

    onDialogShown() {
        let nameValue = '';
        let phoneValue = '';

        if (this.props.selectedMember) {
            nameValue = this.props.selectedMember.name;
            phoneValue = this.props.selectedMember.phone;
        }
        else {
            nameValue = this.props.searchInputValue;
        }

        this.refs.editNameInput.setValue(nameValue);
        this.refs.editPhoneInput.setValue(phoneValue);
    }

    saveMember() {
        let member = {
            name: this.refs.editNameInput.getValue(),
            phone: this.refs.editPhoneInput.getValue()
        };

        let uid = this.state.selectedMember ? this.state.selectedMember.uid : null;

        this.props.saveMember(member, uid);
    }

    componentDidUpdate(prevProps) {
        if (prevProps.showDialog !== this.props.showDialog) {
            if (this.props.showDialog) {
                this.refs.dialog.show();
            }
            else {
                this.refs.dialog.dismiss();
            }
        }
    }

    render() {

        return (
            <div>
                <Dialog ref="dialog" actions={this.standardActions} actionFocus="submit" onShow={this.onDialogShown}
                        modal={true}>
                    <TextField ref="editNameInput" hintText="" floatingLabelText="Name" fullWidth={true}/>
                    <TextField ref="editPhoneInput" type="tel" hintText="" floatingLabelText="Phone Number"
                               fullWidth={true}/>
                </Dialog>
            </div>
        )
    }
}
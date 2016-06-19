import React, {Component, PropTypes} from 'react';
import TextField from 'material-ui/TextField';
import FlatButton from 'material-ui/FlatButton';
import Dialog from 'material-ui/Dialog';
import keycode from 'keycode';

class EditMember extends Component {
  constructor(props) {
    super(props);

    this.saveMember = this.saveMember.bind(this);
    this.cancel = this.cancel.bind(this);
    this.onInputEnter = this.onInputEnter.bind(this);
    this.onChangeName = this.onChangeName.bind(this);
    this.onChangePhone = this.onChangePhone.bind(this);

    this.standardActions = [
      <FlatButton
        label="Cancel"
        secondary
        onTouchTap={this.cancel} />,
      <FlatButton
        label="Save"
        primary
        keyboardFocused
        onTouchTap={this.saveMember} />
    ];

    this.state = {
      nameInput: '',
      phoneInput: ''
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.showEditMember) {
      let nameValue = '';
      let phoneValue = '';

      if (nextProps.selectedMember) {
        nameValue = nextProps.selectedMember.name;
        phoneValue = nextProps.selectedMember.phone;
      } else {
        nameValue = nextProps.searchInputValue;
      }

      this.setState({
        nameInput: nameValue,
        phoneInput: phoneValue
      });
    } else {
      this.setState({
        nameInput: '',
        phoneInput: ''
      });
    }
  }

  shouldComponentUpdate(nextProps) {
    return nextProps.showEditMember || this.props.showEditMember;
  }

  onInputEnter() {
    if (keycode(event) === 'enter') {
      this.saveMember();
    }
  }

  onChangeName(e) {
    this.setState({
      nameInput: e.target.value
    });
  }
  onChangePhone(e) {
    this.setState({
      phoneInput: e.target.value
    });
  }

  cancel() {
    this.props.onCancel();
  }

  saveMember() {
    const member = {
      name: this.state.nameInput,
      phone: this.state.phoneInput
    };

    const uid = this.props.selectedMember ? this.props.selectedMember.uid : null;

    this.props.saveMember(member, uid);
  }

  render() {
    return (
      <div>
        <Dialog open={this.props.showEditMember} actions={this.standardActions} modal>
          <TextField
            value={this.state.nameInput || ''} onChange={this.onChangeName}
            hintText="" floatingLabelText="Name" fullWidth />
          <TextField
            value={this.state.phoneInput || ''} onChange={this.onChangePhone} type="tel" hintText=""
            floatingLabelText="Phone Number" fullWidth onKeyDown={this.onInputEnter} />
        </Dialog>
      </div>
    );
  }
}

EditMember.propTypes = {
  showEditMember: PropTypes.bool,
  searchInputValue: PropTypes.string,
  selectedMember: PropTypes.object,
  saveMember: PropTypes.func,
  onCancel: PropTypes.func
};

export default EditMember;

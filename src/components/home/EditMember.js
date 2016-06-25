import React, {Component, PropTypes} from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
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

    this.isDesktop = window.innerWidth > 600;
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
    if (this.isDesktop) {
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

    const mobileContainer = {
      position: 'fixed',
      zIndex: 30,
      backgroundColor: 'white',
      top: '0px',
      left: '0px',
      width: '100%'
    };

    const mobileBackdrop = {
      position: 'fixed',
      height: '100%',
      width: '100%',
      top: '0px',
      left: '0px',
      zIndex: 20,
      backgroundColor: 'rgba(0, 0, 0, 0.541176)',
    };

    return (
      <ReactCSSTransitionGroup
        transitionName="edit-member" transitionEnterTimeout={500} transitionLeaveTimeout={300}>
        {this.props.showEditMember && (<div>
          <div style={mobileContainer} data-layout-padding>
            <TextField
              value={this.state.nameInput || ''} onChange={this.onChangeName}
              hintText="" floatingLabelText="Name" fullWidth />
            <TextField
              value={this.state.phoneInput || ''} onChange={this.onChangePhone} type="tel" hintText=""
              floatingLabelText="Phone Number" fullWidth onKeyDown={this.onInputEnter} />
            <div data-layout="row" data-layout-padding>
              {this.standardActions.map((item, index) => {
                return <div key={index}>{item}</div>;
              }) }
            </div>
          </div>
          <div style={mobileBackdrop}>
          </div>
        </div>) }
      </ReactCSSTransitionGroup>
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

import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import RaisedButton from 'material-ui/RaisedButton';
import ClipboardButton from 'react-clipboard.js';
import Snackbar from 'material-ui/Snackbar';
import { getPhoneList } from '../actions/phoneList';

class PhoneList extends Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.loadPhoneList = this.loadPhoneList.bind(this);
    this.onCopied = this.onCopied.bind(this);
    this.handleRequestCloseSnackbar = this.handleRequestCloseSnackbar.bind(this);
  }

  state = {
    value: 0,
    openSnackbar: false
  };

  onCopied() {
    this.setState({
      openSnackbar: true,
    });
  }

  handleChange(event, index, value) {
    this.setState({ value });
  }

  handleRequestCloseSnackbar() {
    this.setState({
      openSnackbar: false,
    });
  }

  loadPhoneList() {
    this.props.getPhoneList(this.state.value);
  }

  render() {
    let content;
    if (this.props.isInit) {
      content = <div />;
    } else if (this.props.isLoading) {
      content = <div>Loading...</div>;
    } else if (!this.props.isLoading) {
      content = (
        <div>
          <div>Selected Events:</div>
          <br />
          <div style={{ wordWrap: 'break-word' }}>
            {this.props.eventNames.join(', ')}
          </div>
          <br />
          <div>Phone Numbers: (Total = {this.props.phones.length})</div>
          <br />
          <div>
            <ClipboardButton
              data-clipboard-text={this.props.phones.join(';')}
              onSuccess={this.onCopied} button-title="Copy">
              Copy to Clipboard
            </ClipboardButton>
          </div>
          <br />
          <div style={{ wordWrap: 'break-word' }}>
            {this.props.phones.join(';')}
          </div>
        </div>
      );
    }

    return (
      <div data-layout-margin>
        <div data-layout="row" data-layout-align="center center">
          <div data-layout-padding>
            <SelectField
              floatingLabelText="Get Phone List from:"
              value={this.state.value}
              onChange={this.handleChange}>
              <MenuItem value={0} primaryText="All Events" />
              <MenuItem value={3} primaryText="Last 3 Events" />
              <MenuItem value={4} primaryText="Last 4 Events" />
              <MenuItem value={6} primaryText="Last 6 Events" />
            </SelectField>
          </div>
          <div data-layout-padding>
            <RaisedButton label="Load" primary onClick={this.loadPhoneList} />
          </div>
        </div>
        <div>
          {content}
        </div>
        <Snackbar
          open={this.state.openSnackbar}
          message="Phone List is copied to clipboard"
          autoHideDuration={4000}
          onRequestClose={this.handleRequestCloseSnackbar} />
      </div>
    );
  }
}

PhoneList.propTypes = {
  isInit: PropTypes.bool,
  isLoading: PropTypes.bool,
  phones: PropTypes.arrayOf(PropTypes.string),
  eventNames: PropTypes.arrayOf(PropTypes.string),
  getPhoneList: PropTypes.func
};

function mapStateProps(state) {
  const {phoneList} = state;
  return {
    isInit: phoneList.phones === undefined,
    isLoading: phoneList.phones === null,
    phones: phoneList.phones,
    eventNames: phoneList.eventNames
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ getPhoneList }, dispatch);
}

export default connect(mapStateProps, mapDispatchToProps)(PhoneList);

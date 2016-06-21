import React from 'react';
import TextField from 'material-ui/TextField';
import Attendance from './Attendance';
import keycode from 'keycode';

function debounce(func) {
  let timeout;
  return (...args) => {
    const self = this;
    const later = () => {
      timeout = null;
      func.apply(self, args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, 250);
  };
}


class Search extends React.Component {
  constructor(props) {
    super(props);

    this.onSearchEnter = this.onSearchEnter.bind(this);
    this.onChangeSearchText = this.onChangeSearchText.bind(this);
    this.updateSearchResult = debounce(this.updateSearchResult.bind(this), 250);

    this.containers = [];
    for (let i = 0; i < 50; i++) { this.containers.push(''); }

    this.state = {
      filteredMembers: []
    };
  }

  onSearchEnter(event) {
    if (keycode(event) === 'enter' && this.state.filteredMembers.length === 1) {
      this.props.setAttendance(this.state.filteredMembers[0].uid, true);
    }
  }

  onChangeSearchText(e) {
    const inputValue = e.target.value;

    this.props.onSearchInputChange(inputValue);
    this.updateSearchResult(inputValue);
  }

  updateSearchResult(inputValue) {
    const val = inputValue.toLowerCase();
    const arr = [];

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
          const items = this.props.members[key];
          arr.push(...items);
          count += items.length;
        }

        return false;
      });
    }

    this.setState({
      filteredMembers: arr
    });
  }

  render() {
    return (
      <div>
        <div>
          <TextField
            hintText="Search User" fullWidth
            onChange={this.onChangeSearchText} onKeyDown={this.onSearchEnter} />
        </div>
        <div>
          {
            this.containers.map((temp, i) => {
              const member = i <= this.state.filteredMembers.length ? this.state.filteredMembers[i] : null;
              return (<Attendance
                key={i} member={member}
                isAttended={member && this.props.attendances[member.uid]}
                setAttendance={this.props.setAttendance} editMember={this.props.editMember} />);
            })
          }
        </div>
      </div>
    );
  }
}

Search.propTypes = {
  members: React.PropTypes.object,
  attendances: React.PropTypes.object,
  setAttendance: React.PropTypes.func,
  editMember: React.PropTypes.func,
  onSearchInputChange: React.PropTypes.func
};

export default Search;

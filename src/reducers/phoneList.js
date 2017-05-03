import {
  LOADPHONES_START,
  LOADPHONES_SUCCESS
} from '../actions/phoneList';

const initialState = {};

function phoneList(state = initialState, action = {}) {
  switch (action.type) {
    case LOADPHONES_START:
      return {
        ...state,
        phones: null,
        eventNames: null
      };
    case LOADPHONES_SUCCESS:
      return {
        ...state,
        phones: action.phones,
        eventNames: action.eventNames
      };
    default:
      return state;
  }
}

export default phoneList;

import {
    RELOADEVENTS_SUCCESS,
    LOADOPENEVENT_SUCCESS,
    UPDATEEVENT_SUCCESS,
    RELOADEVENTATTENDANCES_SUCCESS
} from '../actions/event';

const initialState = {};

function event(state = initialState, action = {}) {
  switch (action.type) {
    case RELOADEVENTS_SUCCESS:
      return {
        ...state,
        events: action.events
      };
    case UPDATEEVENT_SUCCESS:
      return {
        ...state
      };
    case LOADOPENEVENT_SUCCESS:
      return {
        ...state,
        openedEvents: action.openedEvents
      };
    case RELOADEVENTATTENDANCES_SUCCESS:
      return {
        ...state,
        attendances: action.attendances
      };
    default:
      return state;
  }
}

export default event;

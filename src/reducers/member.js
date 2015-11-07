import {
    ATTACHMEMBER_SUCCESS,
    LOADMEMBER_SUCCESS,
    UPDATEMEMBER_SUCCESS
} from '../actions/member';

const initialState = {};

function member(state = initialState, action = {}) {
    switch (action.type) {
        case ATTACHMEMBER_SUCCESS:
        case LOADMEMBER_SUCCESS:
            return {
                ...state,
                members: action.members
            };
        case UPDATEMEMBER_SUCCESS:
            return {
                ...state,
                memberUid: action.memberUid
            };
        default:
            return state;
    }
}

export default member;

import {
    LOGIN_REQUEST, LOGIN_SUCCESS, LOGIN_FAILURE,
    LOGOUT_SUCCESS,
    SSOLOGIN_REQUEST, SSOLOGIN_SUCCESS,
    AUTH_CHECKED
} from '../actions/auth';

const initialState = {};

function auth(state = initialState, action = {}) {
    switch (action.type) {
        case LOGIN_REQUEST:
            return {
                ...state,
                loggingIn: true
            };
        case LOGIN_SUCCESS:
            return {
                ...state,
                loggingIn: false,
                user: action.user,
                loginError: ''
            };
        case LOGIN_FAILURE:
            return {
                ...state,
                loggingIn: false,
                user: null,
                loginError: action.error.message
            };
        case SSOLOGIN_REQUEST:
            return {
                ...state,
                loggingIn: true
            };
        case SSOLOGIN_SUCCESS:
            return {
                ...state,
                loggingIn: false,
                user: action.user
            };
        case LOGOUT_SUCCESS:
            return {
                ...state,
                user: null
            };
        case AUTH_CHECKED:
            return {
                ...state,
                user: action.user
            };
        default:
            return state;
    }
}

export default auth;
import Firebase from 'firebase';
import {BASE_URL} from './constant';
const baseRef = new Firebase(BASE_URL);
const loginsRef = baseRef.child('logins');
const eventAdminsRef = baseRef.child('eventAdmins');

export const AUTH_CHECKED = 'AUTH_CHECKED';

export const LOGIN_REQUEST = 'LOGIN_REQUEST';
export const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
export const LOGIN_FAILURE = 'LOGIN_FAILURE';

export const SSOLOGIN_REQUEST = 'SSOLOGIN_REQUEST';
export const SSOLOGIN_SUCCESS = 'SSOLOGIN_SUCCESS';
export const SSOLOGIN_FAILURE = 'SSOLOGIN_FAILURE';

export const LOGOUT_SUCCESS = 'LOGOUT_SUCCESS';


function login(user, password) {

    function loginRequest() {
        return {
            type: LOGIN_REQUEST
        };
    }

    function loginSuccess(user) {
        return {
            type: LOGIN_SUCCESS,
            user: user
        };
    }

    function loginFailure(error) {
        return {
            type: LOGIN_FAILURE,
            error: error
        };
    }

    return (dispatch) => {
        dispatch(loginRequest(user));

        baseRef.authWithPassword({
            email: user,
            password: password
        }, (error, authData) => {
            if (error) {
                dispatch(loginFailure(error));
            }
            else {
                eventAdminsRef.child(authData.uid).once('value', (snapshot) => {
                    let authUser = {
                        isSuperUser: false,
                        eventUid: snapshot.val()
                    };

                    localStorage.setItem('authUser', JSON.stringify(authUser));

                    dispatch(loginSuccess(authUser))
                });
            }
        })
    };
}


function logout() {
    baseRef.unauth();
    localStorage.removeItem('authUser');

    return (dispatch) => {
        dispatch({
            type: LOGOUT_SUCCESS
        })
    }
}

function ssoLogin() {
    function ssoLoginRequest() {
        return {
            type: SSOLOGIN_REQUEST
        }
    }

    function ssoLoginSuccess(user) {
        return {
            type: SSOLOGIN_SUCCESS,
            user: user
        }
    }

    function ssoLoginFailure() {
        return {
            type: SSOLOGIN_FAILURE
        }
    }

    return (dispatch) => {
        dispatch(ssoLoginRequest());

        baseRef.authWithOAuthPopup("google", function (error, authData) {
            if (error) {
                console.log("Login Failed!", error);
                dispatch(ssoLoginFailure());
            } else {
                baseRef.child('testAuth').once('value', (snaphost) => {
                    let authUser = {
                        isSuperUser: true,
                        eventUid: null
                    };

                    localStorage.setItem('authUser', JSON.stringify(authUser));

                    dispatch(ssoLoginSuccess(authUser));
                }, (error) => {
                    console.log(error);
                    dispatch(ssoLoginFailure());
                });
            }
        }, {
            scope: "email"
        });
    }
}

function checkAuth() {
    return (dispatch) => {
        let authUser = null;

        let authData = baseRef.getAuth();
        if(authData) {
            authUser = JSON.parse(localStorage.getItem('authUser'));
        }

        dispatch({
            type: AUTH_CHECKED,
            user: authUser
        });
    }
}

export {ssoLogin, login, logout, checkAuth};
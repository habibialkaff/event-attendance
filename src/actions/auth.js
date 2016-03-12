import Firebase from 'firebase';
import {BASE_URL} from './constant';
const baseRef = new Firebase(BASE_URL);
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

                    dispatch(loginSuccess(authUser));
                });
            }
        });
    };
}


function logout() {
    baseRef.unauth();
    localStorage.removeItem('authUser');

    return (dispatch) => {
        dispatch({
            type: LOGOUT_SUCCESS
        });
    };
}

function ssoLogin() {
    function ssoLoginRequest() {
        return {
            type: SSOLOGIN_REQUEST
        };
    }

    function ssoLoginSuccess(user) {
        return {
            type: SSOLOGIN_SUCCESS,
            user: user
        };
    }

    function ssoLoginFailure() {
        return {
            type: SSOLOGIN_FAILURE
        };
    }

    return (dispatch) => {
        let ssoError = (error) => {
            console.log('Login Failed!', error);
            dispatch(ssoLoginFailure());
        };

        dispatch(ssoLoginRequest());

        baseRef.authWithOAuthPopup('google', (error) => {
            if (error) {
                if (error.code === 'TRANSPORT_UNAVAILABLE') {
                    baseRef.authWithOAuthRedirect('google', (error) => {
                        if(error) {
                            ssoError(error);
                        }
                    });
                }
                else {
                    ssoError(error);
                }
            } else {
                let authUser = {
                    isSuperUser: true,
                    eventUid: null
                };

                validateAndStoreUser(authUser, (authUser, error) => {
                    if (!error) {
                        dispatch(ssoLoginSuccess(authUser));
                    }
                    else {
                        ssoError(error);
                    }
                });
            }
        }, {
            scope: 'email'
        });
    };
}

function validateAndStoreUser(authUser, cb) {
    baseRef.child('testAuth').once('value', () => {
        localStorage.setItem('authUser', JSON.stringify(authUser));
        cb(authUser, null);
    }, (error) => {
        cb(null, error);
    });
}

function checkAuth() {
    return (dispatch) => {
        let callback = (authData) => {
            let authChecked = (authUser, error) => {
                if (!error) {
                    dispatch({
                        type: AUTH_CHECKED,
                        user: authUser
                    });
                }
            };

            if (authData) {
                let authUser = JSON.parse(localStorage.getItem('authUser'));

                if (!authUser) {
                    //Oauth redirect
                    authUser = {
                        isSuperUser: true,
                        eventUid: null
                    };

                    validateAndStoreUser(authUser, authChecked);
                }
                else {
                    authChecked(authUser, null);
                }
            }

            baseRef.offAuth(callback);
        };

        baseRef.onAuth(callback);
    };
}

export {ssoLogin, login, logout, checkAuth};
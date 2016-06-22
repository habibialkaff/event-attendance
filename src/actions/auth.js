import firebase from 'firebase';
import {firebaseRef} from './constant';
import {authStorage} from '../helpers/authStorage.js';

const eventAdminsRef = firebaseRef.child('eventAdmins');

export const AUTH_CHECKED = 'AUTH_CHECKED';

export const LOGIN_REQUEST = 'LOGIN_REQUEST';
export const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
export const LOGIN_FAILURE = 'LOGIN_FAILURE';

export const SSOLOGIN_REQUEST = 'SSOLOGIN_REQUEST';
export const SSOLOGIN_SUCCESS = 'SSOLOGIN_SUCCESS';
export const SSOLOGIN_FAILURE = 'SSOLOGIN_FAILURE';

export const LOGOUT_SUCCESS = 'LOGOUT_SUCCESS';

function validateAndStoreUser(authUser, cb) {
  firebaseRef.child('testAuth').once('value')
    .then(() => {
      authStorage.save(authUser);
      cb(authUser, null);
    }, (error) => {
      cb(null, error);
    });
}

function logout() {
  firebase.auth().signOut();
  authStorage.remove();

  return (dispatch) => {
    dispatch({
      type: LOGOUT_SUCCESS
    });
  };
}

function login(username, password) {
  function loginRequest() {
    return {
      type: LOGIN_REQUEST
    };
  }

  function loginSuccess(user) {
    return {
      type: LOGIN_SUCCESS,
      user
    };
  }

  function loginFailure(error) {
    return {
      type: LOGIN_FAILURE,
      error
    };
  }

  return (dispatch) => {
    dispatch(loginRequest(username));

    firebase.auth().signInWithEmailAndPassword(username, password)
      .then((authData) => {
        eventAdminsRef.child(authData.uid).once('value', (snapshot) => {
          const authUser = {
            isSuperUser: false,
            eventUid: snapshot.val()
          };

          authStorage.save(authUser);

          dispatch(loginSuccess(authUser));
        });
      })
      .catch((error) => {
        dispatch(loginFailure(error));
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
      user
    };
  }

  function ssoLoginFailure() {
    return {
      type: SSOLOGIN_FAILURE
    };
  }

  return (dispatch) => {
    const ssoError = (error) => {
      console.log('Login Failed!', error);
      dispatch(ssoLoginFailure());
    };

    dispatch(ssoLoginRequest());

    const auth = firebase.auth();
    const provider = new firebase.auth.GoogleAuthProvider();
    provider.addScope('email');
    auth.signInWithPopup(provider).then(() => {
      const authUser = {
        isSuperUser: true,
        eventUid: null
      };

      validateAndStoreUser(authUser, (user, error) => {
        if (!error) {
          dispatch(ssoLoginSuccess(user));
        } else {
          ssoError(error);
        }
      });
    }).catch((popupError) => {
      if (popupError.code === 'TRANSPORT_UNAVAILABLE') {
        auth.signInWithRedirect(provider)
          .catch((redirectError) => {
            ssoError(redirectError);
          });
      } else {
        ssoError(popupError);
      }
    });
  };
}

function checkAuth() {
  return (dispatch) => {
    const authChecked = (user, error) => {
      if (!error) {
        dispatch({
          type: AUTH_CHECKED,
          user
        });
      }
    };

    let unsubscribe = null;

    const callback = (authData) => {
      if (authData) {
        let authUser = authStorage.get();

        if (!authUser) {
          // Oauth redirect
          authUser = {
            isSuperUser: true,
            eventUid: null
          };

          validateAndStoreUser(authUser, authChecked);
        } else {
          authChecked(authUser, null);
        }
      } else {
        authChecked(null, null);
      }

      unsubscribe();
    };

    unsubscribe = firebase.auth().onAuthStateChanged(callback);
  };
}

export {ssoLogin, login, logout, checkAuth};

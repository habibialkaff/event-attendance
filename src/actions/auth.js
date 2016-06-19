import {firebaseRef} from './constant';

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
  firebaseRef.child('testAuth').once('value', () => {
    localStorage.setItem('authUser', JSON.stringify(authUser));
    cb(authUser, null);
  }, (error) => {
    cb(null, error);
  });
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

    firebaseRef.authWithPassword({
      email: username,
      password
    }, (error, authData) => {
      if (error) {
        dispatch(loginFailure(error));
      } else {
        eventAdminsRef.child(authData.uid).once('value', (snapshot) => {
          const authUser = {
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
  firebaseRef.unauth();
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

    firebaseRef.authWithOAuthPopup('google', (popupError) => {
      if (popupError) {
        if (popupError.code === 'TRANSPORT_UNAVAILABLE') {
          firebaseRef.authWithOAuthRedirect('google', (redirectError) => {
            if (redirectError) {
              ssoError(redirectError);
            }
          });
        } else {
          ssoError(popupError);
        }
      } else {
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
      }
    },
      {
        scope: 'email'
      });
  };
}

function checkAuth() {
  return (dispatch) => {
    const callback = (authData) => {
      const authChecked = (authUser, error) => {
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
          // Oauth redirect
          authUser = {
            isSuperUser: true,
            eventUid: null
          };

          validateAndStoreUser(authUser, authChecked);
        } else {
          authChecked(authUser, null);
        }
      }

      firebaseRef.offAuth(callback);
    };

    firebaseRef.onAuth(callback);
  };
}

export {ssoLogin, login, logout, checkAuth};

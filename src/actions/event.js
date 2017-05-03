import * as firebase from 'firebase';
import { firebaseRef, firebaseConfig } from './constant';

export const RELOADEVENTS_SUCCESS = 'RELOADEVENTS_SUCCESS';
export const LOADOPENEVENT_SUCCESS = 'LOADOPENEVENT_SUCCESS';
export const UPDATEEVENT_REQUEST = 'UPDATEEVENT_REQUEST';
export const UPDATEEVENT_SUCCESS = 'UPDATEEVENT_SUCCESS';
export const RELOADEVENTATTENDANCES_SUCCESS = 'RELOADEVENTATTENDANCES_SUCCESS';

const eventsRef = firebaseRef.child('events');
const eventAdminsRef = firebaseRef.child('eventAdmins');

function registerEventAdmin(eventId) {
  function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
  }

  return new Promise((resolve) => {
    const email = `${getRandomInt(1, 1000)}@event.com`;
    const password = `${getRandomInt(100000, 999999)}`;

    const secondaryApp = firebase.initializeApp(firebaseConfig, 'Secondary');

    secondaryApp.auth().createUserWithEmailAndPassword(email, password)
      .then((authData) => {
        const eventAdmin = {
          [authData.uid]: eventId
        };

        resolve({
          uid: authData.uid,
          email,
          password
        });

        return eventAdminsRef.update(eventAdmin);
      })
      .catch((error) => {
        console.log(error);
      })
      .catch(() => Promise.resolve())
      .then(() => {
        secondaryApp.auth().signOut();
        secondaryApp.delete();
      });
  });
}

function removeEventAdmin(admin) {
  const secondaryApp = firebase.initializeApp(firebaseConfig, 'Secondary');
  let user;

  return secondaryApp.auth().signInWithEmailAndPassword(admin.email, admin.password)
    .then(() => {
      user = secondaryApp.auth().currentUser;
      const credential = firebase.auth.EmailAuthProvider.credential(admin.email, admin.password);

      return user.reauthenticate(credential);
    })
    .then(() => {
      return user.delete();
    })
    .then(() => {
      return eventAdminsRef.child(admin.uid).remove();
    })
    .catch((error) => {
      console.log(error);
      return Promise.resolve();
    })
    .then(() => {
      secondaryApp.auth().signOut();
      secondaryApp.delete();
    });
}

function attachLoadEvents() {
  function loadSuccess(data) {
    return {
      type: RELOADEVENTS_SUCCESS,
      events: data
    };
  }

  return (dispatch) => {
    eventsRef.on('value', (snapshot) => {
      dispatch(loadSuccess(snapshot.val()));
    }, (error) => {
      console.log(error);
    });
  };
}

function detachLoadEvents() {
  return () => {
    eventsRef.off('value');
  };
}

function loadOpenEvents(eventUid) {
  function loadSuccess(data) {
    return {
      type: LOADOPENEVENT_SUCCESS,
      openedEvents: data
    };
  }

  return (dispatch) => {
    if (eventUid) {
      eventsRef.child(eventUid).once('value', (snapshot) => {
        const events = {};
        events[eventUid] = snapshot.val();
        dispatch(loadSuccess(events));
      }, (error) => {
        console.log(error);
      });
    } else {
      eventsRef.orderByChild('isClosed').equalTo(false).once('value', (snapshot) => {
        dispatch(loadSuccess(snapshot.val()));
      }, (error) => {
        console.log(error);
      });
    }
  };
}

function update(event, uid) {
  return (dispatch) => {
    dispatch({
      type: UPDATEEVENT_REQUEST
    });
    if (!uid) {
      const childRef = eventsRef.push();

      registerEventAdmin(childRef.key).then((auth) => {
        event.admin = auth;

        childRef.set(event, () => {
          dispatch({
            type: UPDATEEVENT_SUCCESS
          });
        });
      });
    } else if (event.isClosed) {
      removeEventAdmin(event.admin).then(() => {
        event.admin = {};
        eventsRef.child(uid).set(event, () => {
          dispatch({
            type: UPDATEEVENT_SUCCESS
          });
        });
      });
    } else {
      registerEventAdmin(uid).then((auth) => {
        event.admin = auth;
        eventsRef.child(uid).set(event, () => {
          dispatch({
            type: UPDATEEVENT_SUCCESS
          });
        });
      });
    }
  };
}

function attachEventAttendance(eventUid) {
  function attachSuccess(data) {
    return {
      type: RELOADEVENTATTENDANCES_SUCCESS,
      attendances: data
    };
  }

  return (dispatch) => {
    eventsRef.child(eventUid).child('attendances').on('value', (snapshot) => {
      dispatch(attachSuccess(snapshot.val()));
    });
  };
}

function detachEventAttendance(eventUid) {
  return () => {
    eventsRef.child(eventUid).child('attendances').off('value');
  };
}

function updateAttendance(memberUid, eventUid, isAttended) {
  return () => {
    const childRef = eventsRef.child(eventUid).child('attendances');
    childRef.child(memberUid).set(isAttended);
  };
}

export {
  attachLoadEvents, detachLoadEvents, loadOpenEvents,
  update, updateAttendance, attachEventAttendance, detachEventAttendance
};


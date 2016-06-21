import firebase from 'firebase';
import {firebaseRef} from './constant';

export const RELOADEVENTS_SUCCESS = 'RELOADEVENTS_SUCCESS';
export const LOADOPENEVENT_SUCCESS = 'LOADOPENEVENT_SUCCESS';
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

    firebase.auth().createUserWithEmailAndPassword(email, password)
      .then((authData) => {
        const eventAdmin = {
          [authData.uid]: eventId
        };

        eventAdminsRef.update(eventAdmin).then((...params) => {
          console.log(params);
        }).catch((...params) => {
          console.log(params);
        });

        resolve({
          uid: authData.uid,
          email,
          password
        });
      })
      .catch((error) => {
        console.log(error);
      });
  });
}

function removeEventAdmin(admin) {
  return new Promise((resolve) => {
    resolve(admin);
    // firebaseRef.removeUser({
    //   email: admin.email,
    //   password: admin.password
    // }, () => {
    //   eventAdminsRef.child(admin.uid).remove();
    //   resolve();
    // });
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
  return () => {
    if (!uid) {
      const childRef = eventsRef.push();

      registerEventAdmin(childRef.key).then((auth) => {
        event.admin = auth;

        childRef.set(event, () => {

        });
      });
    } else {
      if (event.isClosed) {
        removeEventAdmin(event.admin);
        event.admin = {};
        eventsRef.child(uid).set(event);
      } else {
        registerEventAdmin(uid).then((auth) => {
          event.admin = auth;
          eventsRef.child(uid).set(event);
        });
      }
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

export {attachLoadEvents, detachLoadEvents, loadOpenEvents,
update, updateAttendance, attachEventAttendance, detachEventAttendance};


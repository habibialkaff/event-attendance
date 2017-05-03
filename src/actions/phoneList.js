import { firebaseRef } from './constant';

export const LOADPHONES_START = 'LOADPHONES_START';
export const LOADPHONES_SUCCESS = 'LOADPHONES_SUCCESS';

function sanitizePhone(phone = '') {
  phone = phone.replace(' ', '').replace('+65', '').replace('+62', '');

  if (phone.startsWith('0')) {
    phone = phone.slice(1);
  }

  if (phone.startsWith('65')) {
    phone = phone.slice(2);
  }

  if ((phone.startsWith('8') || phone.startsWith('9')) && phone.length === 8) {
    return phone;
  }

  return '';
}

/**
 * @param {string[]} arr
 * @returns string[]
 */
function removeDuplicates(arr) {
  const obj = {};
  for (let i = 0; i < arr.length; i++) {
    obj[arr[i]] = true;
  }

  return Object.keys(obj).map((key) => key);
}

export function getPhoneList(eventsCount = 0) {
  return (dispatch) => {
    dispatch({
      type: LOADPHONES_START
    });

    Promise.all([firebaseRef.child('members').once('value'), firebaseRef.child('events').once('value')])
      .then(([memberSnapshot, eventSnapshot]) => {
        const names = [];
        const invalidPhones = [];
        const validPhones = [];

        const eventObj = eventSnapshot.val();
        const end = eventsCount === 0 ? Object.keys(eventObj).length : eventsCount;
        const events = Object.keys(eventObj).map((key) => {
          return {
            id: key,
            ...eventObj[key]
          };
        }).sort((a, b) => {
          if (b.id < a.id) return -1;
          if (b.id > a.id) return 1;
          return 0;
        }).slice(0, end);

        const validAttendanceIds = {};
        events.forEach((event) => {
          const attendances = event.attendances || {};
          Object.keys(attendances).forEach((memberId) => {
            if (attendances[memberId]) {
              validAttendanceIds[memberId] = true;
            }
          });
        });

        const members = memberSnapshot.val();
        Object.keys(members).forEach((memberId) => {
          const item = members[memberId];

          if (item.name) {
            names.push(item.name);
          }

          const phone = (item.phone || '').toString();

          const sanitizedPhone = sanitizePhone(phone);

          if (sanitizedPhone && validAttendanceIds[memberId]) {
            validPhones.push(sanitizedPhone);
          } else {
            invalidPhones.push(phone);
          }
        });

        const result = removeDuplicates(validPhones);
        dispatch({
          type: LOADPHONES_SUCCESS,
          phones: result,
          eventNames: events.map((evt) => evt.name)
        });
      });
  };
}

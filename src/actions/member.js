import {firebaseRef} from './constant';

export const LOADMEMBER_SUCCESS = 'LOADMEMBER_SUCCESS';
export const UPDATEMEMBER_SUCCESS = 'UPDATEMEMBER_SUCCESS';

const membersRef = firebaseRef.child('members');

function attachLoadMembers() {
  function loadSuccess(data) {
    const members = {};

    Object.keys(data).forEach((key) => {
      if (data[key].name !== '' || data[key].phone !== '') {
        if (!members[data[key].name]) {
          members[data[key].name] = [];
        }

        members[data[key].name].push({
          uid: key,
          name: data[key].name,
          phone: data[key].phone
        });
      }
    });

    return {
      type: LOADMEMBER_SUCCESS,
      members
    };
  }

  return (dispatch) => {
    membersRef.on('value', (snapshot) => {
      dispatch(loadSuccess(snapshot.val()));
    }, (error) => {
      console.log(error);
    });
  };
}

function detachLoadMembers() {
  return () => {
    membersRef.off('value');
  };
}

function updateMember(member, uid) {
  function updateSuccess(memberUid) {
    member.uid = memberUid;
    return {
      type: UPDATEMEMBER_SUCCESS,
      memberUid
    };
  }


  return (dispatch) => {
    let childRef;

    if (!uid) {
      childRef = membersRef.push();
      uid = childRef.key;
    } else {
      childRef = membersRef.child(uid);
    }

    childRef.set(member, (error) => {
      if (error) {
        console.log(error);
      } else {
        dispatch(updateSuccess(uid));
      }
    });
  };
}

export {attachLoadMembers, detachLoadMembers, updateMember};

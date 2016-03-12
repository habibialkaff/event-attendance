import Firebase from 'firebase';
import {BASE_URL} from './constant';

export const LOADMEMBER_SUCCESS = 'LOADMEMBER_SUCCESS';
export const UPDATEMEMBER_SUCCESS = 'UPDATEMEMBER_SUCCESS';

const baseRef = new Firebase(BASE_URL);
const membersRef = baseRef.child('members');

function attachLoadMembers() {
    function loadSuccess(data) {
        var members = {};

        for (let i in data) {
            if (data.hasOwnProperty(i)) {
                if (data[i].name == '' && data[i].phone == '') {
                    continue;
                }

                if (!members[data[i].name]) {
                    members[data[i].name] = [];
                }

                members[data[i].name].push({
                    uid: i,
                    name: data[i].name,
                    phone: data[i].phone
                });
            }
        }

        return {
            type: LOADMEMBER_SUCCESS,
            members: members
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
            memberUid: memberUid
        };
    }


    return (dispatch) => {
        let childRef;

        if (!uid) {
            childRef = membersRef.push();
            uid = childRef.key();
        }
        else {
            childRef = membersRef.child(uid);
        }

        childRef.set(member, (error) => {
            if (error) {
                console.log(error);
            }
            else {
                dispatch(updateSuccess(uid));
            }
        });
    };
}

export {attachLoadMembers, detachLoadMembers, updateMember};
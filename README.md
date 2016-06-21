# Event Attendance
A sample website using React, Redux, Firebase and Material-UI

## Firebase Rules:

```JSON
{
    "rules": {
      "events": {
        ".indexOn": ["isClosed"],
        "$eventUid": {
          ".read": "root.child('eventAdmins').child(auth.uid).val() === $eventUid",
          ".write": "root.child('eventAdmins').child(auth.uid).val() === $eventUid",
          "attendances": {
            ".write": "root.child('eventAdmins').child(auth.uid).val() === $eventUid"
          }
        }
      },
      "eventAdmins": {
        "$adminUid": {
          ".read": "$adminUid === auth.uid",
          ".write": "$adminUid === auth.uid"
        }
      },
      "members": {
        ".read": "root.child('eventAdmins').child(auth.uid).exists()",
        ".write": "root.child('eventAdmins').child(auth.uid).exists()"
      },
      "testAuth": {
        ".read": "root.child('eventAdmins').child(auth.uid).exists()"
      },
      ".read": "root.child('admins').child(auth.uid).exists()",
      ".write": "root.child('admins').child(auth.uid).exists()"
    }
}
```

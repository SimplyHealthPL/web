const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

exports.addUser = functions.https.onCall((data, context) => {
    return admin.auth().createUser({
        email: data.email
    })
    .then(userRecord => {
        return {uid: userRecord.uid};
    })
    .catch( error => {
        return error;
    });
});

exports.deleteUser = functions.https.onCall((data, context) => {
    return admin.auth().deleteUser(data.uid)
    .then(() => {
        return true;
    })
    .catch( error => {
        return error;
    });
});

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const admin = require("firebase-admin");
admin.initializeApp();
var fcm_1 = require("./fcm");
exports.subscribeToTopic = fcm_1.subscribeToTopic;
exports.unsubscribeFromTopic = fcm_1.unsubscribeFromTopic;
exports.sendOnFirestoreCreate = fcm_1.sendOnFirestoreCreate;
// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
// export const helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });
//# sourceMappingURL=index.js.map
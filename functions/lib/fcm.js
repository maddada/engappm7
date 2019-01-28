"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const functions = require("firebase-functions");
const admin = require("firebase-admin");
// __ Make this for all cities!
exports.subscribeToTopic = functions.https.onCall((data, context) => __awaiter(this, void 0, void 0, function* () {
    yield admin.messaging().subscribeToTopic(data.token, data.topic);
    return `subscribed to ${data.topic}`;
}));
exports.unsubscribeFromTopic = functions.https.onCall((data, context) => __awaiter(this, void 0, void 0, function* () {
    yield admin.messaging().unsubscribeFromTopic(data.token, data.topic);
    return `unsubscribed from ${data.topic}`;
}));
exports.sendOnFirestoreCreate = functions.firestore
    .document('notifications/{notificationID}')
    .onCreate((snapshot) => __awaiter(this, void 0, void 0, function* () {
    const message = snapshot.data();
    const notification = {
        title: 'Message from Memar!',
        body: message.body
    };
    const payload = {
        notification,
        webpush: {
            notification: {
                // vibrate: [200, 100, 200],
                vibrate: [100],
                icon: 'https://memar.ae/assets/icon/favicon.png',
            }
        },
        topic: 'notifications'
    };
    return admin.messaging().send(payload);
}));
//# sourceMappingURL=fcm.js.map
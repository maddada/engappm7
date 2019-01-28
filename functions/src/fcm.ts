import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

// __ Make this for all cities!

export const subscribeToTopic = functions.https.onCall(
    async (data, context) => {
        await admin.messaging().subscribeToTopic(data.token, data.topic);

        return `subscribed to ${data.topic}`;
    }
);

export const unsubscribeFromTopic = functions.https.onCall(
    async (data, context) => {
        await admin.messaging().unsubscribeFromTopic(data.token, data.topic);

        return `unsubscribed from ${data.topic}`;
    }
);

export const sendOnFirestoreCreate = functions.firestore
    .document('notifications/{notificationID}')
    .onCreate(async snapshot => {
        const message = snapshot.data();

        const notification: admin.messaging.Notification = {
            title: 'Message from Memar!',
            body: message.body
        };

        const payload: admin.messaging.Message = {
            notification,
            webpush: {
                notification: {
                    // vibrate: [200, 100, 200],
                    vibrate: [100],
                    icon: 'https://memar.ae/assets/icon/favicon.png',
                    // actions: [
                    //     {
                    //         action: 'like',
                    //         title: '👍 Yaaay!'
                    //     },
                    //     {
                    //         action: 'dislike',
                    //         title: '☹ Boooo!'
                    //     }
                    // ]
                }
            },
            topic: 'notifications'
        };

        return admin.messaging().send(payload);
    });
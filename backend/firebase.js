const admin = require('firebase-admin');
const serviceAccount = require('./chandrettante-chayakkada-firebase-adminsdk-fbsvc-d16510f9ec.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

module.exports = { db };

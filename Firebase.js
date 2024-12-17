// filepath: /c:/izs/Firebase.js
const { initializeApp } = require('firebase/app');
const { getAuth } = require('firebase/auth');
const { getFirestore } = require('firebase/firestore');
const { getStorage } = require('firebase/storage');
const loadSecrets = require('./loadSecrets');

(async () => {
  const secrets = await loadSecrets();

  const firebaseConfig = {
    apiKey: secrets.apiKey,
    authDomain: secrets.authDomain,
    projectId: secrets.projectId,
    storageBucket: secrets.storageBucket,
    messagingSenderId: secrets.messagingSenderId,
    appId: secrets.appId,
    measurementId: secrets.measurementId,
  };

  const app = initializeApp(firebaseConfig);
  module.exports.auth = getAuth(app);
  module.exports.db = getFirestore(app);
  module.exports.storage = getStorage(app);
})();
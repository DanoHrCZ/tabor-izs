const { SecretManagerServiceClient } = require('@google-cloud/secret-manager');

const client = new SecretManagerServiceClient();

async function accessSecretVersion(name) {
  const [version] = await client.accessSecretVersion({ name });
  return version.payload.data.toString('utf8');
}

async function loadSecrets() {
  const secrets = {
    apiKey: await accessSecretVersion('projects/YOUR_PROJECT_ID/secrets/NEXT_PUBLIC_API_KEY/versions/latest'),
    authDomain: await accessSecretVersion('projects/YOUR_PROJECT_ID/secrets/NEXT_PUBLIC_AUTH_DOMAIN/versions/latest'),
    projectId: await accessSecretVersion('projects/YOUR_PROJECT_ID/secrets/NEXT_PUBLIC_PROJECT_ID/versions/latest'),
    storageBucket: await accessSecretVersion('projects/YOUR_PROJECT_ID/secrets/NEXT_PUBLIC_STORAGE_BUCKET/versions/latest'),
    messagingSenderId: await accessSecretVersion('projects/YOUR_PROJECT_ID/secrets/NEXT_PUBLIC_MESSAGING_SENDER_ID/versions/latest'),
    appId: await accessSecretVersion('projects/YOUR_PROJECT_ID/secrets/NEXT_PUBLIC_APP_ID/versions/latest'),
    measurementId: await accessSecretVersion('projects/YOUR_PROJECT_ID/secrets/NEXT_PUBLIC_MEASUREMENT_ID/versions/latest'),
  };
  return secrets;
}

module.exports = loadSecrets;
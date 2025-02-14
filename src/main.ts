import './style.css'
import { Config, FRAuth } from '@forgerock/javascript-sdk';

Config.set({
  clientId: 'aj-public-sdk-client', // e.g. 'ForgeRockSDKClient'
  redirectUri: `http://localhost:3000`, // e.g. 'https://sdkapp.example.com:8443/callback.html'
  scope: 'openid profile email address revoke', // e.g. 'openid profile email address phone'
  serverConfig: {
      baseUrl: 'https://openam-sdks.forgeblocks.com/am', // e.g. 'https://myorg.forgeblocks.com/am' or 'https://openam.example.com:8443/openam'
      timeout: 3000, // 90000 or less
  },
  realmPath: 'alpha', // e.g. 'alpha' or 'root'
  tree: 'Login', // e.g. 'sdkAuthenticationTree' or 'Login'
});

const firstStep = FRAuth.start();
console.log('firstStep', firstStep);
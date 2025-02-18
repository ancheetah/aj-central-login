import "./style.css";
import {
  Config,
  FRUser,
  TokenManager,
} from "@forgerock/javascript-sdk";

Config.set({
  clientId: "aj-public-sdk-client", // e.g. 'ForgeRockSDKClient'
  redirectUri: `http://localhost:3000`, // e.g. 'https://sdkapp.example.com:8443/callback.html'
  scope: "openid profile email address revoke", // e.g. 'openid profile email address phone'
  serverConfig: {
    baseUrl: "https://openam-sdks.forgeblocks.com/am", // e.g. 'https://myorg.forgeblocks.com/am' or 'https://openam.example.com:8443/openam'
    timeout: 3000, // 90000 or less
  },
  realmPath: "alpha", // e.g. 'alpha' or 'root'
  tree: "Login", // e.g. 'sdkAuthenticationTree' or 'Login'
});

async function handleLogin(): Promise<void> {
  try {
    // Start authenitcation flow
    // 'redirect' option enables central login directly with auth server
    await TokenManager.getTokens({ login: 'redirect' });
  } catch (err) {
    console.error('Failed to start authentication flow', err);
  }
}

async function handleLogout(): Promise<void> {
  try {
    await FRUser.logout();
    location.reload();
  } catch (err) {
    throw new Error(`Failed to logout: ${err}`);
  }
}

async function authorize(code: string, state: string): Promise<void> {
    console.log('authorizing...', code, state);
    // todo: trade code and state for an access token
}

// Add login/logout event listeners
document
  .getElementById("login-button")
  ?.addEventListener("click", handleLogin);
document
  .getElementById("logout-button")
  ?.addEventListener("click", handleLogout);

// Check URL for query parameters
const url = new URL(window.location.href);
const params = url.searchParams;
const authCode = params.get('code');
const state = params.get('state');
console.log(url, params);

// If this was a redirect then start authorization flow
if (authCode && state) {
  authorize(authCode, state);
}
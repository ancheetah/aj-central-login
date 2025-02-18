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
    await TokenManager.getTokens({ login: 'redirect' })
  } catch (err) {
    console.error('Failed to start auth flow', err);
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

document
  .getElementById("login-button")
  ?.addEventListener("click", handleLogin);
document
  .getElementById("logout-button")
  ?.addEventListener("click", handleLogout);

import "./style.css";
import {
  Config,
  FRAuth,
  FRCallback,
  FRStep,
  FRUser,
} from "@forgerock/javascript-sdk";
import { mapCallbacksToComponents } from "./components";

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

const panelFormElem = document.getElementById("panel-form");

async function handleSubmit(event: Event, step?: FRStep): Promise<void> {
  event.preventDefault();
  step?.callbacks.forEach((cb) => setCallbackValue(cb));
  await nextStep(step);
  console.log("submitted!", step);
}

async function handleLogout(): Promise<void> {
  try {
    await FRUser.logout();
    location.reload();
  } catch (err) {
    throw new Error(`Failed to logout: ${err}`);
  }
}

async function nextStep(previousStep?: FRStep): Promise<void> {
  if (!panelFormElem) {
    throw new Error("Failed to find panel");
  }

  try {
    const nextStep = await FRAuth.next(previousStep);
    console.log("nextStep", nextStep);
    if (nextStep.type === "Step") {
      nextStep.callbacks.forEach((cb) =>
        mapCallbacksToComponents(cb, panelFormElem)
      );
      panelFormElem?.removeEventListener("submit", handleSubmit);
      panelFormElem?.addEventListener("submit", (event) =>
        handleSubmit(event, nextStep)
      );
    } else {
      // Handle login success or failure
      console.log("todo: handle login success or failure");
    }
  } catch (error) {
    console.error("nextStep error: ", error);
    panelFormElem.innerHTML = "Error";
  }
}


function setCallbackValue(cb: FRCallback): void {
  const cbType = cb.getType();
  if (["NameCallback", "PasswordCallback"].includes(cbType)) {
    const input = panelFormElem?.querySelector(
      `input[name=${cbType === "NameCallback" ? "username" : "password"}]`
    );
    if (input instanceof HTMLInputElement) {
      cb.setInputValue(input.value);
    } else {
      throw new Error(`Failed to set callback. Not found. ${cbType}`);
    }
  } else {
    throw new Error(`Failed to set callback. Unknown callback type: ${cbType}`);
  }
}

document
  .getElementById("logout-button")
  ?.addEventListener("click", handleLogout);

// Start the authentication flow
try {
  await nextStep();
} catch (error) {
  console.error("Error starting authentication flow: ", error);
}

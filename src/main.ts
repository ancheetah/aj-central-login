import './style.css'
import { Config, FRAuth, FRCallback, FRStep } from '@forgerock/javascript-sdk';

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

const panelFormElem = document.getElementById('panel-form');
const submitButtonElem = document.getElementById('submit-button');

async function handleSubmit(event: Event, step?: FRStep) {
  event.preventDefault();
  console.log('submitted!', step);
}

async function nextStep(previousStep?: FRStep) {
  try {
    const nextStep = await FRAuth.next(previousStep);
    console.log('nextStep', nextStep);
    if (nextStep.type === 'Step') {
      nextStep.callbacks.forEach(mapCallbacksToComponents);
    } else {
      // Handle login success or failure
    }
  } catch (error) {
    console.error('nextStep error: ', error);
    if (panelFormElem) {
      panelFormElem.innerHTML = 'Error';
    } 
  }
} 


function renderTextInputCallback(cb: FRCallback, inputID: string) {
  const prompt = cb.getOutputByName('prompt', '');
  const wrapper = document.createElement('div');

  const label = document.createElement('label');
  label.setAttribute('for', prompt);
  label.innerHTML = prompt;

  const input = document.createElement('input');
  input.setAttribute('type', cb.getType() === 'PasswordCallback' ? 'password' : 'text');
  input.setAttribute('id', inputID);
  input.setAttribute('name', inputID);
  input.setAttribute('required', 'true');

  wrapper.appendChild(label);
  wrapper.appendChild(input);

  panelFormElem?.insertBefore(wrapper, submitButtonElem);
}

function mapCallbacksToComponents(cb: FRCallback) {
  const cbType = cb.getType();
  switch (cbType) {
    case 'NameCallback':
    case 'PasswordCallback':
      renderTextInputCallback(cb, cbType === 'NameCallback' ? 'name' : 'password');
      break;
    default:
      throw new Error(`Unknown callback type: ${cbType}`);
  }
}

await nextStep();
panelFormElem?.addEventListener('submit', (event) => handleSubmit(event));
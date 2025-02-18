import { FRCallback } from "@forgerock/javascript-sdk";

export function mapCallbacksToComponents(
  cb: FRCallback,
  formElem: HTMLElement
): void {
  const cbType = cb.getType();
  switch (cbType) {
    case "NameCallback":
    case "PasswordCallback":
      renderTextInput(
        cb,
        cbType === "NameCallback" ? "username" : "password",
        formElem
      );
      break;
    default:
      throw new Error(`Unknown callback type: ${cbType}`);
  }
}

function renderTextInput(
  cb: FRCallback,
  inputID: string,
  formElem: HTMLElement
): void {
  const prompt = cb.getOutputByName("prompt", "");
  const wrapper = document.createElement("div");

  const label = document.createElement("label");
  label.setAttribute("for", prompt);
  label.innerHTML = prompt;

  const input = document.createElement("input");
  input.setAttribute(
    "type",
    cb.getType() === "PasswordCallback" ? "password" : "text"
  );
  // input.setAttribute("id", inputID);
  input.setAttribute("name", inputID);
  input.setAttribute("required", "true");

  wrapper.appendChild(label);
  wrapper.appendChild(input);

  const submitButtonElem = document.getElementById("submit-button");
  formElem.insertBefore(wrapper, submitButtonElem);
}

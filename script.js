// ==UserScript==
// @name     AWS SSO Displayname
// @version  1
// @grant    none
// @include      https://console.aws.amazon.*
// @include      https://*.console.aws.amazon.*
// ==/UserScript==

// Add your AWS account information below
const accounts = {
  786908262739: ["root"],
  264850291039: ["production", "red"],
  274593078001: ["staging", "blue"],
  128405919384: ["shared", "gray"],
  998726572012: ["testing", "yellow"],
  891749101823: ["personal"],
};

const NO_COLOR = null;

const extractRole = (displayName) => {
  return /\w+_(\w+)_\w+/.exec(displayName)[1];
};

const getAccountInfo = (accountId) => {
  const [alias, color] = accounts[accountId] || [accountId, NO_COLOR];
  return { alias, color };
};

const accountId = document.querySelector(
  '[data-testid="aws-my-account-details"]'
).textContent;

console.debug({ accountId });

const { alias, color } = getAccountInfo(accountId);

const displayName = document.querySelector(
  "#awsc-login-display-name-user"
).textContent;

console.debug({ displayName });

const role = extractRole(displayName);

console.debug({ role });

const dropdownHeader = document.querySelector(
  '[data-testid="awsc-nav-account-menu-button"] [title]'
);

dropdownHeader.innerHTML = `${role}@${alias}`;

if (color !== NO_COLOR) {
  dropdownHeader.style.backgroundColor = color;
}

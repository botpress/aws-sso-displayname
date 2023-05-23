// ==UserScript==
// @name     AWS SSO Displayname
// @description Makes it clearer which AWS account you are currently logged into.
// @version  2.0.2
// @grant    none
// @include      https://console.aws.amazon.*
// @include      https://*.console.aws.amazon.*
// ==/UserScript==

// Add your AWS account information below
// You can use the following command to populate an initial map without colors:
// $ aws organizations list-accounts | jq -r '.Accounts | map(.Id + ": [\"" + .Name + "\"],")[]'
const accounts = {
  786908262739: ["root"],
  264850291039: ["production", "red"],
  274593078001: ["staging", "blue"],
  128405919384: ["shared", "gray"],
  998726572012: ["testing", "yellow"],
  891749101823: ["personal"],
}

const NO_COLOR = null;
const POLL_INTERVAL = 100;

const extractRole = (displayName) => {
  return /(\w+)\/\w+/.exec(displayName)[1];
};

const getAccountInfo = (accountId) => {
  const [alias, color] = accounts[accountId] || [accountId, NO_COLOR];
  return { alias, color };
};

const getTitleElement = () =>
  document.querySelector("span[title^='AWSReservedSSO']");

const getDisplayNameElement = () =>
  document.querySelector(
    '[data-testid="awsc-nav-account-menu-button"] > span:nth-child(1)'
  );

const getDropdownHeaderElement = () =>
  document.querySelector(
    '[data-testid="awsc-nav-account-menu-button"] [title]'
  );

const isReady = () =>
  getTitleElement() && getDisplayNameElement() && getDropdownHeaderElement();

const interval = setInterval(() => {
  if (isReady()) {
    clearInterval(interval);
    onReady();
  }
}, POLL_INTERVAL);

function onReady(elem) {
  const accountId = getTitleElement()
    .getAttribute("title")
    .match(/AWSReservedSSO_.*\s(.*)/)[1]
    .replace(/-/g, "");
  const { alias, color } = getAccountInfo(accountId);

  // Expected element format is "<span title="AWSReservedSSO_AdministratorAccess_f23ec324f447d77/jake @ onvp-production" class="_1Vtx1Z7gxtNZJP2MVzVCLO _31GHADTBDW3BW3qVhZRFPq">AdministratorAccess/jake</span>"
  const displayName = getDisplayNameElement().textContent;

  console.debug({ displayName });
  // Expecting "AdministratorAccess/jake"

  const role = extractRole(displayName);

  console.debug({ role });
  // Expecting "AdministratorAccess"

  const dropdownHeader = getDropdownHeaderElement();

  dropdownHeader.innerHTML = `${role}@${alias}`;

  if (color !== NO_COLOR) {
    dropdownHeader.style.backgroundColor = color;
  }
}
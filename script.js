// ==UserScript==
// @name     AWS SSO Displayname
// @description Makes it clearer which AWS account you are currently logged into.
// @version  2
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
}

const NO_COLOR = null

const extractRole = (displayName) => {
  return /(\w+)\/\w+/.exec(displayName)[1]
}

const getAccountInfo = (accountId) => {
  const [alias, color] = accounts[accountId] || [accountId, NO_COLOR]
  return { alias, color }
}

// Expected element format is "<span>5424-2879-6143<span>"
const accountId = document.querySelector(
  '[data-testid="account-detail-menu"] > div:nth-child(1) > div:nth-child(1) > span:nth-child(2)'
).textContent.replace(/-/g, '')

console.debug({ accountId })
// Expecting "786908262739"

const { alias, color } = getAccountInfo(accountId)

// Expected element format is "<span title="AWSReservedSSO_AdministratorAccess_f23ec324f447d77/jake @ onvp-production" class="_1Vtx1Z7gxtNZJP2MVzVCLO _31GHADTBDW3BW3qVhZRFPq">AdministratorAccess/jake</span>"
const displayName = document.querySelector(
  '[data-testid="awsc-nav-account-menu-button"] > span:nth-child(1)'
).textContent

console.debug({ displayName })
// Expecting "AdministratorAccess/jake"

const role = extractRole(displayName)

console.debug({ role })
// Expecting "AdministratorAccess"

const dropdownHeader = document.querySelector(
  '[data-testid="awsc-nav-account-menu-button"] [title]'
)

dropdownHeader.innerHTML = `${role}@${alias}`

if (color !== NO_COLOR) {
  dropdownHeader.style.backgroundColor = color
}

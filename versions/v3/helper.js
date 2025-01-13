// This will filter out accented characters and other special characters
function isValidAlphabetString(str) {
  if (!str || typeof str !== "string") {
    return false;
  }

  return str.split("").every((char) => {
    const ascii = char.charCodeAt(0);
    return (ascii >= 65 && ascii <= 90) || (ascii >= 97 && ascii <= 122);
  });
}

// this will send message to popup.html
function setBadgeToMessage(msg) {
  badge = msg;
  chrome.browserAction.setBadgeText({ text: badge });
}

export { isValidAlphabetString, setBadgeToMessage };

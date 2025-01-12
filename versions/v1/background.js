// var currentTabUrl = "initial";

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

(async () => {
  // see the note below on how to choose currentWindow or lastFocusedWindow
  const [tab] = await chrome.tabs.query({
    active: true,
    lastFocusedWindow: true,
  });
  const currentTabUrl = tab.url;

  const data = {
    url: currentTabUrl,
    isValid: isValidAlphabetString(currentTabUrl),
  };
  chrome.storage.local.set({ data }, () => {
    console.log("Data saved to storage:", data);
  });
})();

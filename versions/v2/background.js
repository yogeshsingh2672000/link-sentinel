// Function to validate the URL based on custom criteria
function isValidAlphabetString(str) {
  if (!str || typeof str !== "string") {
    return false;
  }

  return str.split("").every((char) => {
    const ascii = char.charCodeAt(0);
    return (ascii >= 65 && ascii <= 90) || (ascii >= 97 && ascii <= 122);
  });
}

// Function to handle URL validation
function handleTabUrlChange(tabId) {
  chrome.tabs.get(tabId, (tab) => {
    if (chrome.runtime.lastError || !tab || !tab.url) {
      console.error(
        "Unable to retrieve tab information:",
        chrome.runtime.lastError
      );
      return;
    }

    const currentTabUrl = tab.url;
    const isValid = isValidAlphabetString(currentTabUrl);

    const data = {
      url: currentTabUrl,
      isValid,
    };

    // Save data to storage
    chrome.storage.local.set({ data }, () => {
      console.log("Data saved to storage:", data);
    });
  });
}

// Listener for when a tab is updated (e.g., URL changes)
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === "complete" && tab.active) {
    handleTabUrlChange(tabId);
  }
});

// Listener for when the active tab changes
chrome.tabs.onActivated.addListener((activeInfo) => {
  handleTabUrlChange(activeInfo.tabId);
});

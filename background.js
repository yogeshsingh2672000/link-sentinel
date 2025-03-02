function extractDomain(url) {
  const pattern = /^(?:https?:\/\/)?(www\.[a-zA-Z0-9.-]+)\/?$/;
  const match = url.match(pattern);
  if (match) {
    return match[1];
  } else {
    return null; // Returns null if the URL doesn't match the expected pattern
  }
}

// Function to validate the URL based on custom criteria
function isValidAlphabetString(url) {
  const str = extractDomain(url);
  if (!str || typeof str !== "string") {
    return false;
  }

  return str.split("").every((char) => {
    const ascii = char.charCodeAt(0);
    return (
      (ascii >= 65 && ascii <= 90) || // A-Z
      (ascii >= 97 && ascii <= 122) || // a-z
      (ascii >= 48 && ascii <= 57) || // 0-9
      char === "." ||
      char === "-" ||
      char === "_"
    );
  });
}

// Function to handle URL validation and send to popup
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

    const log = {
      url: currentTabUrl,
      isValid,
      timestamp: new Date().toISOString(), // Add timestamp to log
    };

    // Send log data to popup.js (or other listeners)
    chrome.runtime.sendMessage({
      type: "newValidation",
      log, // Send log directly here
    });

    // Optionally save data to local storage (for persistence across browser sessions)
    chrome.storage.local.get("history", (result) => {
      const history = result.history || [];
      history.push(log);

      // Limit history length to 10 entries (you can adjust this number)
      if (history.length > 10) {
        history.pop(); // Remove the oldest log if history exceeds 10 entries
      }

      // Save updated history back to storage
      chrome.storage.local.set({ history });
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

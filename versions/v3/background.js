// Function to validate the URL based on custom criteria
function getDomain(url, subdomain = false) {
  subdomain = subdomain || false;

  url = url.replace(/(https?:\/\/)?(www.)?/i, "");

  if (!subdomain) {
    url = url.split(".");

    url = url.slice(url.length - 2).join(".");
  }

  if (url.indexOf("/") !== -1) {
    return url.split("/")[0];
  }

  console.log(url);
  return url;
}

function isValidAlphabetString(url) {
  const str = getDomain(url);
  if (!str || typeof str !== "string") {
    return false;
  }

  return str.split("").every((char) => {
    const ascii = char.charCodeAt(0);
    return (ascii >= 65 && ascii <= 90) || (ascii >= 97 && ascii <= 122);
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
    };

    // Send log data to popup.js
    chrome.runtime.sendMessage({
      type: "newValidation",
      log,
    });

    // Optionally save data to local storage (for persistence across browser sessions)
    chrome.storage.local.get("history", (result) => {
      const history = result.history || [];
      history.unshift(log); // Add new log at the top (unshift)

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

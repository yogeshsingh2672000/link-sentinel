document.addEventListener("DOMContentLoaded", function () {
  // Function to update the popup with URL validation history
  function updatePopup() {
    chrome.storage.local.get("history", (result) => {
      if (chrome.runtime.lastError) {
        console.error("Error getting storage:", chrome.runtime.lastError);
      } else {
        const history = result.history || [];

        if (history.length === 0) {
          document.getElementById("activityList").innerHTML =
            "<p>No history available.</p>";
        } else {
          let message = "";
          // Loop through history and create a message for each log (new logs at the top)
          history.forEach((log) => {
            message = `
                <div>
                  <p><strong>URL:</strong> ${log.url}</p>
                  <p><strong>Is Valid:</strong> ${
                    log.isValid ? "Yes" : "No"
                  }</p>
                  <hr />
                  ${message}
                </div>`;
          });
          document.getElementById("activityList").innerHTML = message;
        }
      }
    });
  }

  // Update the history and popup whenever a new URL validation is saved
  function saveHistory(newLog) {
    chrome.storage.local.get("history", (result) => {
      const history = result.history || [];
      history.unshift(newLog); // Add new log at the top (unshift)

      // Limit history length to 10 entries (you can adjust this number)
      if (history.length > 10) {
        history.pop(); // Remove the oldest log if history exceeds 10 entries
      }

      // Save updated history back to storage
      chrome.storage.local.set({ history }, () => {
        updatePopup(); // Update the popup with the latest history
      });
    });
  }

  // Listen for storage changes and update the popup accordingly
  chrome.storage.onChanged.addListener((changes, area) => {
    if (area === "local" && changes.history) {
      updatePopup();
    }
  });

  // Update the popup initially with stored history
  updatePopup();

  // Add event listener for any new URL data from background.js
  chrome.runtime.onMessage.addListener((message) => {
    if (message.type === "newValidation") {
      saveHistory(message.log);
    }
  });
});

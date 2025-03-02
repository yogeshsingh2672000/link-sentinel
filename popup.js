document.addEventListener("DOMContentLoaded", function () {
  // Function to update the popup with URL validation history
  function updatePopup() {
    chrome.storage.local.get("history", (result) => {
      if (chrome.runtime.lastError) {
        console.error("Error getting storage:", chrome.runtime.lastError);
      } else {
        const history = result.history || [];

        const activityList = document.getElementById("activityList");

        // Clear the current list before updating
        activityList.innerHTML = "";

        if (history.length === 0) {
          activityList.innerHTML = "<p>No history available.</p>";
        } else {
          // Reverse the history array to show the latest log at the top
          history.reverse().forEach((log) => {
            const logDiv = document.createElement("div");

            const url = document.createElement("p");
            url.innerHTML = `<strong>URL:</strong> ${log.url}`;

            const isValid = document.createElement("p");
            isValid.innerHTML = `<strong>Is Valid:</strong> ${
              log.isValid ? "Yes" : "No"
            }`;

            const timestamp = document.createElement("p");
            timestamp.innerHTML = `<strong>Timestamp:</strong> ${new Date(
              log.timestamp
            ).toLocaleString()}`;

            const hr = document.createElement("hr");

            // Append all elements to the logDiv
            logDiv.appendChild(url);
            logDiv.appendChild(isValid);
            logDiv.appendChild(timestamp);
            logDiv.appendChild(hr);

            // Append the logDiv to the activity list (latest at top)
            activityList.appendChild(logDiv);
          });
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
      saveHistory(message.log); // Now message.log is correctly handled
    }
  });
});

document.addEventListener("DOMContentLoaded", function () {
  let currentTabValidations;
  let message;

  chrome.storage.local.get("data", (result) => {
    if (chrome.runtime.lastError) {
      console.error("Error getting storage:", chrome.runtime.lastError);
    } else {
      console.log("Retrieved data:", result.data);
      currentTabValidations = result.data;
      message = `<div>The current tab's URL is ${result.data.isValid}</div>`;
      document.getElementById("activityList").innerHTML = message;
    }
  });
});

// Listen for messages from the extension's popup window
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  // Check for a request to toggle the extension's active state
  if (request.toggle) {
    // Toggle the extension's active state
    chrome.storage.local.set({ active: !request.active });
  }
});

// Set the default active state to false
chrome.storage.local.set({ active: false });

// Listen for changes to the active state
chrome.storage.onChanged.addListener((changes, namespace) => {
  // Check for changes to the 'active' key
  if (changes.active) {
    // Get the current active state
    const active = changes.active.newValue;

    // Set the extension's icon and title based on the active state
    if (active) {
      chrome.browserAction.setIcon({ path: 'icon-active.png' });
      chrome.browserAction.setTitle({ title: 'OpenGPT-Assistant Voice (active)' });
    } else {
      chrome.browserAction.setIcon({ path: 'icon.png' });
      chrome.browserAction.setTitle({ title: 'OpenGPT-Assistant Voice (inactive)' });
    }
  }
});

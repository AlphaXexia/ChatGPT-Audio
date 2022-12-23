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
      // Start listening for response messages
      listenForResponses();
    } else {
      chrome.browserAction.setIcon({ path: 'icon.png' });
      chrome.browserAction.setTitle({ title: 'OpenGPT-Assistant Voice (inactive)' });
      // Stop listening for response messages
      stopListeningForResponses();
    }
  }
});

// Function to start listening for response messages
function listenForResponses() {
  // Add a listener to intercept response messages
  chrome.webRequest.onBeforeRequest.addListener(
    (details) => {
      // Check if the request is a response message
      if (details.url.startsWith('https://chat.openai.com/api/conversations/')) {
        // Synthesize the response message using the main.py script
        synthesizeResponse(details.requestBody.formData.text[0]);
      }
    },
    {
      urls: ['https://chat.openai.com/api/conversations/*'],
      types: ['xmlhttprequest'],
    },
    ['requestBody']
  );
}

// Function to stop listening for response messages
function stopListeningForResponses() {
  // Remove the listener for intercepting response messages
  chrome.webRequest.onBeforeRequest.removeListener(listenForResponses);
}

// Function to synthesize a response message using the main.py script
function synthesizeResponse(text) {
  // Run the main.py script with the response message as an argument
  const options = {
    scriptPath: './',
    args: [text],
  };
  PythonShell.run('main.py', options, (err) => {
    if (err) throw err;
    // Play the synthesized audio
    const audio = new Audio('voice.mp3');
    audio.play();
  });
}

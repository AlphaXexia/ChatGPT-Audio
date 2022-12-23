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
// Listen for response messages from the chat page
function listenForResponses() {
  chrome.webRequest.onBeforeRequest.addListener(
    function(details) { // <-- define the function as an anonymous function here
      // Check if the request is a response message
      if (details.url.includes('/api/v1/messages')) {
        // Get the message text from the request body
        const message = getMessageFromRequestBody(details.requestBody.raw[0].bytes);
        // Synthesize the voice for the message
        synthesizeVoice(message);
      }
    },
    { urls: ['https://chat.openai.com/*'] },
    ['requestBody']
  );
}

// Stop listening for response messages
function stopListeningForResponses() {
  chrome.webRequest.onBeforeRequest.removeListener(listenForResponses);
}

// Extract the message text from a request body object
function getMessageFromRequestBody(requestBody) {
  // Parse the request body as a JSON object
  const body = JSON.parse(String.fromCharCode.apply(null, requestBody));
  // Return the 'text' property from the body object
  return body.text;
}

// Synthesize the voice for a message using the main.py script
function synthesizeVoice(message) {
  // Run the main.py script with the message text as an argument
  chrome.runtime.sendNativeMessage(
    'openai_voice_extension',
    { message: message },
    (response) => {
// Handle the response from the main.py script
if (chrome.runtime.lastError) {
console.error(chrome.runtime.lastError.message);
} else if (response) {
// Play the synthesized audio file
new Audio('voice.mp3').play();
} else {
console.error('Error synthesizing voice');
}
}
);
}

// Get the API key from the environment
const apiKey = process.env.OPENAI_API_KEY;

// Set the API key in the main.py script
chrome.runtime.sendNativeMessage(
'openai_voice_extension',
{ apiKey: apiKey },
(response) => {
if (chrome.runtime.lastError) {
console.error(chrome.runtime.lastError.message);
} else if (!response) {
console.error('Error setting API key');
}
}
);

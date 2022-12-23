const toggleCheckbox = document.getElementById('toggle-checkbox');
const voiceElement = document.getElementById('voice');

// Add an event listener to the toggle checkbox
toggleCheckbox.addEventListener('change', () => {
  // Toggle the 'active' class on the body element
  document.body.classList.toggle('active');

  // Update the checkmark symbol
  const checkmark = toggleCheckbox.nextElementSibling;
  checkmark.textContent = (toggleCheckbox.checked) ? '\u2713' : '';

  // If the extension is active, synthesize and play the voice
  if (document.body.classList.contains('active')) {
    synthesizeAndPlayVoice();
  }
});

// Check the current URL and enable the extension if it is a chat page on chat.openai.com
if (location.hostname === 'chat.openai.com' && location.pathname.startsWith('/chat/')) {
  document.body.classList.add('active');
  toggleCheckbox.checked = true;
  const checkmark = toggleCheckbox.nextElementSibling;
  checkmark.textContent = '\u2713';
  synthesizeAndPlayVoice();
} else {
  // Terminate the extension if the URL is not a chat page on chat.openai.com
  document.body.classList.remove('active');
  toggleCheckbox.checked = false;
  const checkmark = toggleCheckbox.nextElementSibling;
  checkmark.textContent = '';
}

// Synthesize and play the voice using the main.py Python script
function synthesizeAndPlayVoice() {
  const { PythonShell } = require('python-shell');
  PythonShell.run('../main.py', null, (err, results) => {
    if (err) throw err;
    // Set the audio element's source to the synthesized voice file
    voiceElement.src = 'voice.mp3';
    // Play the audio
    voiceElement.play();
  });
}

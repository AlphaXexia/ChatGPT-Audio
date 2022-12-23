// Get the toggle checkbox and extension UI elements
const toggleCheckbox = document.getElementById('toggle-checkbox');
const extensionUi = document.getElementById('extension-ui');

// Add an event listener to the toggle checkbox
toggleCheckbox.addEventListener('change', () => {
  // Toggle the 'active' class on the body element
  document.body.classList.toggle('active');

  // Update the checkmark symbol
  const checkmark = toggleCheckbox.nextElementSibling;
  checkmark.textContent = (toggleCheckbox.checked) ? '\u2713' : '';
});

// Check the current URL and enable the extension if it is a chat page on chat.openai.com
if (location.hostname === 'chat.openai.com' && location.pathname.startsWith('/chat/')) {
  document.body.classList.add('active');
  toggleCheckbox.checked = true;
  const checkmark = toggleCheckbox.nextElementSibling;
  checkmark.textContent = '\u2713';
} else {
  // Terminate the extension if the URL is not a chat page on chat.openai.com
  document.body.classList.remove('active');
  toggleCheckbox.checked = false;
  const checkmark = toggleCheckbox.nextElementSibling;
  checkmark.textContent = '';
}

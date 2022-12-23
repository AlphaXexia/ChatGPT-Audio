import requests
from bs4 import BeautifulSoup
from grabber import get_url

# Get the URL of the chat transcript
url = get_url()

# Send a request to the URL and retrieve the response
response = requests.get(url)

# Parse the response as HTML
soup = BeautifulSoup(response.text, 'html.parser')

# Find all the elements containing a chat message
messages = soup.find_all('div', class_='chat-line__message')

# Initialize a list to store the responses
responses = []

# Iterate over the messages
for message in messages:
    # Check if the message was sent by the Assistant
    if message.find('div', class_='chat-line__message-sender').text.strip() == "Assistant":
        # Extract the message text and add it to the list of responses
        responses.append(message.find('div', class_='chat-line__message-text').text

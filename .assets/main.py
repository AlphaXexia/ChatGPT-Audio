import os
import tempfile

from engine import get_response
from grabber import get_url
from google.cloud import texttospeech

# Get the current URL
url = get_url()

# Get the Assistant's response from the URL
response = get_response(url)

# Set up the Cloud Text-to-Speech client
client = texttospeech.TextToSpeechClient()

# Set up the synthesis input
synthesis_input = texttospeech.types.SynthesisInput(text=response)

# Set up the voice synthesis parameters
voice = texttospeech.types.VoiceSelectionParams(
    language_code='en-US',
    ssml_gender=texttospeech.enums.SsmlVoiceGender.NEUTRAL)

# Set up the audio synthesis parameters
audio_config = texttospeech.types.AudioConfig(
    audio_encoding=texttospeech.enums.AudioEncoding.MP3)

# Synthesize the voice
response = client.synthesize_speech(synthesis_input, voice, audio_config)

# Write the synthesized voice to a temporary file
with tempfile.NamedTemporaryFile() as f:
    f.write(response.audio_content)
    f.flush()
    # Play the synthesized voice using the system's default media player
    os.system(f"open {f.name}")

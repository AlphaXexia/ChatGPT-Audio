import os
import pyttsx3

def synthesize_voice(text):
    # Initialize the text-to-speech engine
    engine = pyttsx3.init()

    # Set the voice to use
    voices = engine.getProperty('voices')
    engine.setProperty('voice', voices[1].id)

    # Set the rate of speech
    rate = engine.getProperty('rate')
    engine.setProperty('rate', rate-50)

    # Synthesize the voice for the given text
    engine.say(text)
    engine.runAndWait()

def main():
    # Read the message to be synthesized from stdin
    text = input()
    synthesize_voice(text)

if __name__ == "__main__":
    main()

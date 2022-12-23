import os
import openai

openai.api_key = "YOUR_API_KEY"

def synthesize_voice(text):
    prompt = (
        f"Please play the following message: {text}"
    )
    completions = openai.Completion.create(
        engine="text-davinci-002",
        prompt=prompt,
        max_tokens=1024,
        n=1,
        stop=None,
        temperature=0.5,
    )
    message = completions.choices[0].text
    message = message.strip()

    # Save the synthesized audio to a file
    with open("voice.mp3", "wb") as f:
        f.write(completions.choices[0].audio)

def main():
    # Read the message to be synthesized from stdin
    text = input()
    synthesize_voice(text)

if __name__ == "__main__":
    main()

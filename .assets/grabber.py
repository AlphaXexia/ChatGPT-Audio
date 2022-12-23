import webbrowser

def get_url():
    # Open a new tab in the default browser
    webbrowser.open_new_tab("about:blank")

    # Execute JavaScript code to get the current URL from the browser's address bar
    url = webbrowser.get().run_script("return window.location.href;")
    return url

# Sanity Check
print(get_url())

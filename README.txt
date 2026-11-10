REVA — AI SEARCH ENGINE
=======================

WINDOWS 10 SETUP (VS CODE)

1. Install Python 3.10 or newer from:
   https://www.python.org/downloads/windows/
   During setup, enable "Add Python to PATH".

2. Extract this ZIP to a folder, for example:
   C:\Reva_AI_Search_Engine

3. Open that folder in Visual Studio Code.
   In VS Code choose Terminal > New Terminal.

4. Create a virtual environment:
   py -m venv .venv

5. Activate it in PowerShell:
   .\.venv\Scripts\Activate.ps1

   If PowerShell blocks activation, run this once in the current terminal:
   Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
   Then activate again.

6. Install packages:
   python -m pip install --upgrade pip
   pip install -r requirements.txt

7. Configure API keys:
   Copy .env.example to a new file named .env.
   Open .env and add your API keys.

   OpenRouter (AI):
   https://openrouter.ai/keys

   Tavily (web search):
   https://tavily.com/

   The providers may offer free credits or limited free tiers, but availability,
   limits, and pricing can change. Check their current pricing before use.
   REVA can start without keys, but AI answers and live web search will be disabled.

8. Start REVA:
   python app.py

9. Open this address in your browser:
   http://127.0.0.1:5000

STOP:
   Press CTRL + C in the VS Code terminal.

IMPORTANT SECURITY NOTES
------------------------
- Do not share your .env file or API keys.
- Do not publish this development server directly to the public internet.
- This starter project is intended for local use on your own computer.
- Browser chat history is stored in local browser storage. Clearing browser
  site data may erase it.
- Web search results can be incomplete or inaccurate. Verify important claims.
- API providers may charge for usage. Set provider spending limits if available.

FEATURES
--------
- REVA chat interface
- AI answers using OpenRouter
- Web search using Tavily
- Website source links
- Follow-up conversation context
- Browser-based chat history
- Copy answer
- Mobile-friendly layout

TROUBLESHOOTING
---------------
"py is not recognized":
   Reinstall Python and select "Add Python to PATH", or use the full path to
   python.exe in your terminal.

"ModuleNotFoundError":
   Activate .venv and run: pip install -r requirements.txt

"AI service could not be reached":
   Check OPENROUTER_API_KEY, model availability, internet access, and provider limits.

"No web results":
   Check TAVILY_API_KEY and your Tavily account limits.

This is a starter search assistant, not a copy of ChatGPT or a full web crawler.

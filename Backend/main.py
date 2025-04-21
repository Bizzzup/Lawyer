import os
import requests
import google.generativeai as genai
from dotenv import load_dotenv
import urllib.parse  # Import urllib for URL encoding

# Load environment variables from .env file
load_dotenv()

# Load document and index with page numbers
indexed_transcript = []
try:
    with open('extracted_text.txt', 'r', encoding='utf-8') as text_file:
        content = text_file.readlines()

    current_page = 1
    for line in content:
        line = line.strip()
        if line:
            indexed_transcript.append(f"[Page {current_page}] {line}")
        if "Page" in line and line.replace("Page", "").strip().isdigit():
            current_page = int(line.replace("Page", "").strip())

    transcript_text = "\n".join(indexed_transcript)
    print(f" Document loaded with {current_page} pages.")
except Exception as e:
    print(f" Error loading document: {e}")
    transcript_text = ""

# Configure Gemini with your API key
genai.configure(api_key="AIzaSyDw9elQf8DvxPCE-LXqPwKlcSoZohI-XPk")  # Set your API key here
model = genai.GenerativeModel('gemini-1.5-pro')

# Create or open the search history file
history_file = 'search_history.txt'

def log_to_history(query: str, response: str):
    with open(history_file, 'a', encoding='utf-8') as file:
        file.write(f"Query: {query}\nResponse: {response}\n{'-'*50}\n")

def view_history():
    if os.path.exists(history_file):
        with open(history_file, 'r', encoding='utf-8') as file:
            print("\n" + "="*50)
            print("SEARCH HISTORY")
            print("="*50)
            print(file.read())
            print("="*50)
    else:
        print("No search history found.")

def fetch_real_time_data(query: str) -> str:
    """
    Fetches real-time structured answers using Perplexity's Sonar-Pro model.

    Parameters:
    ----------
    query : str
        The question or topic to retrieve real-time information about.

    Returns:
    -------
    str
        A structured and clear explanation based on real-time search and knowledge.
    """
    api_key = os.getenv("PERPLEXITY_API_KEY")
    url = "https://api.perplexity.ai/chat/completions"

    headers = {
        "accept": "application/json",
        "content-type": "application/json", 
        "Authorization": f"Bearer {api_key}"
    }

    data = {
        "model": "sonar-pro",
        "messages": [
            {
                "role": "system",
                "content": (
                    "You are a highly knowledgeable assistant that gives factual, real-time information. "
                    "Structure your answers like professional documentation or a research brief. Use markdown format. "
                    "Include sections like **Summary**, **Key Insights**, **Sources** (if applicable), and **Date Retrieved**. "
                    "Be concise but informative. Always return the most recent and relevant data."
                )
            },
            {
                "role": "user",
                "content": query
            }
        ]
    }
    try:
        response = requests.post(url, headers=headers, json=data)
        if response.status_code == 200:
            return response.json()['choices'][0]['message']['content']
        else:
            return f"Error fetching real-time data: {response.status_code} - {response.text}"
    except Exception as e:
        return f"Exception occurred: {e}"

# Main Loop
while True:
    query = input("\nEnter your legal/general question (type 'exit' to quit, 'history' to view past queries, 'perplexity' for real-time search): ").strip().lower()

    if query == 'exit':
        print("\n Thank you for using the Legal Assistant CLI. Welcome back!")
        break

    elif query == 'history':
        view_history()
        continue

    elif query == 'perplexity':
        real_time_query = input(" Enter your real-time query for Perplexity: ").strip()
        print("\n🔎 Fetching real-time data from Perplexity...\n")
        real_time_response = fetch_real_time_data(real_time_query)
        print("\n" + "="*50)
        print("REAL-TIME DATA RESPONSE")
        print("="*50)
        print(real_time_response)
        print("="*50)
        log_to_history(f"Perplexity: {real_time_query}", real_time_response)
        continue

    # If not a Perplexity request, respond using Gemini + document
    print("\n Analyzing document for your query...")
    message = f"""
You are a legal document assistant. Please provide a clear and concise response:

1. Direct Answer:
- Give a brief, focused answer to the question.
- Use simple, clear language.
- Highlight the most relevant information.

2. Supporting Evidence:
- Include 1–2 key quotes from the document.
- Only reference the most important sections.

3. Additional Context (if needed):
- Provide any necessary background or clarification.
- Keep it brief and relevant to the question.

Query: {query}

Transcript:
{transcript_text}
"""

    try:
        response = model.generate_content(
            contents=message,
            generation_config={
                'temperature': 0.7,
                'top_p': 0.8,
                'top_k': 40,
                'max_output_tokens': 2048
            }
        )
        output = response.text
    except Exception as e:
        output = f" Error from Gemini: {e}"

    print("\n" + "="*50)
    print("DOCUMENT-BASED RESPONSE")
    print("="*50)
    print(output)
    print("="*50)

    log_to_history(query, output)

    while True:
        again = input("\nAsk another question? (yes/no): ").strip().lower()
        if again in ['yes', 'y']:
            break
        elif again in ['no', 'n']:
            print("\n Thank you for using the Legal Assistant CLI. Goodbye!")
            exit()
        else:
            print("Please type 'yes' or 'no'.")
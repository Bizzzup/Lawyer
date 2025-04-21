import os
import json
import requests
import google.generativeai as genai
from pathlib import Path
from flask import Flask, request, jsonify, render_template
from flask_cors import CORS
from dotenv import load_dotenv
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address
import time

from utils.file_extract import extract_text
from utils.analyze_document import analyze_document
from utils.save_analysis_to_files import save_analysis_to_files

# Load environment variables
load_dotenv()

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Get the absolute path to the data directory
BASE_DIR = Path(__file__).parent.absolute()
DATA_DIR = BASE_DIR / 'data'

# Ensure data directory exists
if not DATA_DIR.exists():
    DATA_DIR.mkdir(parents=True)

# Configure Gemini
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
model = genai.GenerativeModel('gemini-1.5-pro')

# Perplexity API key (from environment)
PERPLEXITY_API_KEY = os.getenv("PERPLEXITY_API_KEY")
if not PERPLEXITY_API_KEY:
    raise ValueError("Perplexity API key is missing in the environment variables.")

# Initialize rate limiter
limiter = Limiter(
    app=app,
    key_func=get_remote_address,
    default_limits=["200 per day", "50 per hour"]
)

@app.route('/')
def index():
    return render_template('index.html')

# API routes (GET methods)
@app.route('/api/case_types', methods=['GET'])
def get_case_types():
    return read_json_file('case_types.txt')

@app.route('/api/all_case', methods=['GET'])
def all_case():
    return read_json_file('all_case_types.txt')

@app.route('/api/summary', methods=['GET'])
def get_summary():
    return read_json_file("summary.txt")

@app.route('/api/dates', methods=['GET'])
def get_dates():
    return read_json_file('dates.txt', validate_dates=True)

@app.route('/api/monetary_values', methods=['GET'])
def get_monetary_values():
    return read_json_file('monetary_values.txt')

@app.route('/api/document_references', methods=['GET'])
def get_document_references():
    return read_json_file('document_references.txt')

@app.route('/api/sections', methods=['GET'])
def get_sections():
    return read_json_file('sections.txt')

@app.route('/api/sections/<id>', methods=['GET'])
def get_sectionItem(id):
    try:
        with open(DATA_DIR / 'sections.txt', 'r', encoding='utf-8') as file:
            data = json.load(file)
            # Find the section with matching section_id
            section = next((item for item in data if item.get('section_id') == id), None)
            if section:
                return jsonify(section)
            return jsonify({'error': 'Section not found'}), 404
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/document_type', methods=['GET'])
def get_document_type():
    try:    
        with open(DATA_DIR / 'document_type.txt', 'r', encoding='utf-8') as file:
            data = json.load(file)
            return jsonify(data)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/chat_history', methods=['GET'])
def get_chat_history():
    return read_json_file('chat_history.txt')

# Utility function for reading JSON files
def read_json_file(file_name, validate_dates=False):
    try:
        with open(DATA_DIR / file_name, 'r', encoding='utf-8') as file:
            data = json.load(file)

            # Additional validation if required (for dates)
            if validate_dates and file_name == 'dates.txt':
                if not isinstance(data, dict):
                    return jsonify({'error': 'Invalid data format: expected a dictionary'}), 500
                if 'key_dates' not in data or 'other_dates' not in data:
                    return jsonify({'error': 'Missing required fields: key_dates and other_dates'}), 500
                if not isinstance(data['key_dates'], list) or not isinstance(data['other_dates'], list):
                    return jsonify({'error': 'key_dates and other_dates must be arrays'}), 500
                for date in data['key_dates']:
                    if not isinstance(date, dict) or 'date' not in date or 'context' not in date:
                        return jsonify({'error': 'Invalid key date format: expected {date, context}'}), 500

            return jsonify(data)

    except FileNotFoundError:
        return jsonify({'error': f'{file_name} file not found'}), 404
    except json.JSONDecodeError:
        return jsonify({'error': f'Invalid JSON format in {file_name} file'}), 500
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/analyze', methods=['POST'])
def analyze_document_endpoint():
    try:
        if 'file' not in request.files:
            return jsonify({'error': 'No file provided'}), 400
        
        file = request.files['file']
        if file.filename == '':
            return jsonify({'error': 'No file selected'}), 400
            
        # Check file extension
        file_ext = Path(file.filename).suffix.lower()
        if file_ext not in ['.pdf', '.docx', '.txt']:
            return jsonify({'error': f'Unsupported file type: {file_ext}. Please upload a PDF, DOCX, or TXT file.'}), 400
            
        # Create a unique temporary file name
        temp_path = f'temp_uploaded_file_{os.urandom(8).hex()}{file_ext}'
        
        try:
            # Save the uploaded file temporarily
            file.save(temp_path)
            
            # Extract and analyze the document
            extracted_text = extract_text(temp_path)
            
            # Use Gemini for advanced analysis
            message = f"""
            Analyze this legal document and provide:
            1. A concise 200-word summary of the document's key points and purpose
            2. Important dates and deadlines
            3. Monetary values mentioned
            4. Legal references and citations
            5. Document type and purpose
            
            Document text:
            {extracted_text}
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
                ai_analysis = response.text
            except Exception as e:
                ai_analysis = f"AI analysis error: {str(e)}"
            
            # Combine traditional and AI analysis
            analysis_results = analyze_document(extracted_text)
            analysis_results['ai_analysis'] = ai_analysis
            
            # Save the results to separate files
            save_analysis_to_files(analysis_results)
            
            return jsonify(analysis_results)
            
        except ValueError as e:
            return jsonify({'error': str(e)}), 400
        except Exception as e:
            return jsonify({'error': f'Error processing file: {str(e)}'}), 500
        finally:
            # Clean up the temporary file
            if os.path.exists(temp_path):
                try:
                    os.remove(temp_path)
                except Exception as e:
                    print(f"Error removing temporary file: {e}")
        
    except Exception as e:
        return jsonify({'error': f'Server error: {str(e)}'}), 500

def fetch_real_time_data(query: str) -> str:
    """
    Fetches real-time structured answers using Perplexity's Sonar-Pro model.
    """
    url = "https://api.perplexity.ai/chat/completions"
    headers = {
        "accept": "application/json",
        "content-type": "application/json", 
        "Authorization": f"Bearer {PERPLEXITY_API_KEY}"
    }

    data = {
        "model": "sonar-pro",
        "messages": [
            {
                "role": "system",
                "content": (
                    "You are a highly knowledgeable assistant that provides factual and real-time information. "
                    "Your task is to answer the user's question with clean, professional, and relevant content. "
                    "Do not include any special characters such as @, #, $, %, *, &, ^, _, or hyphens in your response. "
                    "Avoid symbols in headings, lists, or tables. Format the content using plain text only. "
                    "Only return accurate and up-to-date information derived from verified sources."
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

@app.route('/api/real-time-search', methods=['POST'])
@limiter.limit("10 per minute")  # Rate limit to 10 requests per minute
def real_time_search():
    try:
        data = request.get_json()
        message = data.get('message')
        chat_history = data.get('chat_history', [])  # Optional chat history from frontend
        context = data.get('context', {})  # Optional context

        if not message:
            return jsonify({'error': 'No message provided'}), 400

        if len(message) > 1000:
            return jsonify({'error': 'Message too long. Maximum 1000 characters allowed.'}), 400

        # Load existing chat history from file if it exists
        full_history = []
        history_path = DATA_DIR / 'chat_history.txt'
        if history_path.exists():
            try:
                with open(history_path, 'r', encoding='utf-8') as file:
                    full_history = json.load(file)
            except Exception as e:
                return jsonify({'error': f'Error reading chat history: {str(e)}'}), 500

        # Prepare context from the last 5 messages
        recent_history = full_history[-5:] if full_history else chat_history[-5:]
        chat_context = "\n".join([f"{msg.get('question', 'User')}: {msg.get('answer', '')}" for msg in recent_history])

        context_str = ""
        if context:
            context_str = f"\nAdditional context: {json.dumps(context)}"

        prompt = f"""
        Previous conversation context (last 5 messages):
        {chat_context}
        {context_str}

        Current question: {message}

        Please provide a detailed and accurate response. If you don't have real-time information, 
        clearly state that and suggest where to find the most up-to-date information.
        """

        # Fetch real-time data from Perplexity
        real_time_data = fetch_real_time_data(prompt)

        # New message object
        new_message = {
            "question": message,
            "answer": real_time_data,
            "timestamp": time.time()
        }

        # Append the new message to full history
        full_history.append(new_message)

        # Save back to file (full history)
        try:
            with open(history_path, 'w', encoding='utf-8') as file:
                json.dump(full_history, file, ensure_ascii=False, indent=4)
        except Exception as e:
            return jsonify({'error': f'Error saving chat history: {str(e)}'}), 500

        return jsonify({
            'result': real_time_data,
            'timestamp': new_message["timestamp"]
        })

    except Exception as e:
        return jsonify({
            'error': f'Server error: {str(e)}',
            'timestamp': time.time()
        }), 500


if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)

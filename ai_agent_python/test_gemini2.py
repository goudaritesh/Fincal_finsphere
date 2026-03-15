import os
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()

try:
    api_key = os.getenv('GEMINI_API_KEY')
    print("API KEY starts with:", str(api_key)[:10] if api_key else "None")
    
    genai.configure(api_key=api_key)
    model = genai.GenerativeModel('gemini-2.5-flash')
    response = model.generate_content('hi')
    print("Success:", response.text)
except Exception as e:
    print("Full Exception:", e)
    import traceback
    traceback.print_exc()

import os
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()

try:
    genai.configure(api_key=os.getenv('GEMINI_API_KEY'))
    model = genai.GenerativeModel('gemini-1.5-flash')
    response = model.generate_content('hi')
    print("Success:", response.text)
except Exception as e:
    print("Full Exception:")
    import traceback
    traceback.print_exc()

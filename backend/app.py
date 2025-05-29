from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import json
import re
from dotenv import load_dotenv
import pdfplumber
from pdf2image import convert_from_path
import pytesseract
import google.generativeai as genai
import requests
from werkzeug.utils import secure_filename
from docx import Document

app = Flask(__name__)
CORS(app)

# Load environment variables
load_dotenv()
genai.configure(api_key=os.getenv("GOOGLE_API_KEY"))

# Configure upload folder
UPLOAD_FOLDER = 'uploads'
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

# Allowed file extensions
ALLOWED_EXTENSIONS = {'pdf', 'doc', 'docx'}

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def extract_text_from_docx(docx_path):
    try:
        doc = Document(docx_path)
        text = []
        for paragraph in doc.paragraphs:
            text.append(paragraph.text)
        return '\n'.join(text)
    except Exception as e:
        print(f"Error extracting text from DOCX: {e}")
        return None

# --------- Resume Text Extraction ---------
def extract_text_from_pdf(pdf_path):
    text = ""
    try:
        with pdfplumber.open(pdf_path) as pdf:
            for page in pdf.pages:
                page_text = page.extract_text()
                if page_text:
                    text += page_text
        if text.strip():
            return text.strip()
    except Exception as e:
        print(f"pdfplumber failed: {e}")

    print("Falling back to OCR for image-based PDF...")
    try:
        images = convert_from_path(pdf_path)
        for image in images:
            text += pytesseract.image_to_string(image) + "\n"
        return text.strip()
    except Exception as e:
        print(f"OCR failed: {e}")
        return None

def extract_text_from_file(file_path):
    file_extension = file_path.rsplit('.', 1)[1].lower()
    if file_extension == 'pdf':
        return extract_text_from_pdf(file_path)
    elif file_extension in ['doc', 'docx']:
        return extract_text_from_docx(file_path)
    return None

# --------- Extract Experience and Projects Section ---------
def extract_relevant_sections(text):
    sections = []
    current_section = None
    lines = text.splitlines()

    section_keywords = ["experience", "projects", "work history", "professional experience","work experience","project"]
    stop_keywords = ["education", "certifications", "skills", "summary", "achievements", "languages"]

    for line in lines:
        lower_line = line.strip().lower()
        if any(kw in lower_line for kw in section_keywords):
            current_section = []
        elif any(kw in lower_line for kw in stop_keywords):
            if current_section:
                sections.append("\n".join(current_section))
                current_section = None
        elif current_section is not None:
            current_section.append(line)

    if current_section:
        sections.append("\n".join(current_section))

    return "\n\n".join(sections).strip()

# --------- API Routes ---------
@app.route('/analyze-resume', methods=['POST'])
def analyze_resume_route():
    try:
        print("Received analyze-resume request")
        if 'resume' not in request.files:
            print("No resume file in request")
            return jsonify({"error": "No resume file provided"}), 400
        
        file = request.files['resume']
        domain = request.form.get('domain')
        
        print(f"Received file: {file.filename}")
        print(f"Domain: {domain}")
        
        if not domain:
            print("No domain provided")
            return jsonify({"error": "No domain provided"}), 400
        
        if file.filename == '':
            print("No file selected")
            return jsonify({"error": "No file selected"}), 400
        
        if not allowed_file(file.filename):
            print("Invalid file format")
            return jsonify({"error": "Only PDF, DOC, and DOCX files are allowed"}), 400
        
        filename = secure_filename(file.filename)
        filepath = os.path.join(UPLOAD_FOLDER, filename)
        print(f"Saving file to: {filepath}")
        file.save(filepath)
        
        try:
            # Extract and process resume text
            print("Extracting text from file...")
            full_resume_text = extract_text_from_file(filepath)
            if not full_resume_text:
                print("Failed to extract text from file")
                return jsonify({"error": "Failed to extract text from file"}), 400
                
            print("Extracting relevant sections...")
            resume_text = extract_relevant_sections(full_resume_text)
            if not resume_text:
                print("No relevant sections found in resume")
                return jsonify({"error": "No relevant sections found in resume"}), 400
            
            # Fetch job descriptions
            print("Fetching job descriptions...")
            jd_list = fetch_multiple_job_descriptions(domain)
            if not jd_list:
                print("Failed to fetch job descriptions")
                return jsonify({"error": "Failed to fetch job descriptions"}), 400
                
            combined_jd_text = "\n---\n".join(jd_list)
            
            # Analyze with Gemini
            print("Analyzing with Gemini...")
            result = analyze_resume(resume_text, combined_jd_text)
            
            # Clean up
            print("Cleaning up temporary files...")
            os.remove(filepath)
            
            print("Analysis completed successfully")
            return jsonify(result)
        except Exception as e:
            print(f"Error during processing: {str(e)}")
            if os.path.exists(filepath):
                os.remove(filepath)
            raise e
    except Exception as e:
        print(f"Error in analyze_resume_route: {str(e)}")
        return jsonify({"error": str(e)}), 500

def analyze_resume(resume_text, combined_jd_text):
    model = genai.GenerativeModel("gemini-1.5-flash")

    base_prompt = f"""
You are a senior technical recruiter and AI assistant specializing in technical skill analysis.

Your task is to analyze the resume and job descriptions provided below and perform a detailed technical skill analysis with high accuracy and consistent formatting.
List each skill as an individual bullet point (do not group multiple skills in one line).

Step 1: Extract ALL technical skills from the resume, including but not limited to:
- Programming languages (e.g., Python, Java, JavaScript, C++, etc.)
- Web technologies (e.g., HTML, CSS, React, Angular, Node.js, etc.)
- Databases (e.g., MySQL, MongoDB, PostgreSQL, etc.)
- Cloud platforms (e.g., AWS, Azure, GCP, etc.)
- Data science tools (e.g., Pandas, NumPy, Scikit-learn, TensorFlow, etc.)
- DevOps tools (e.g., Docker, Kubernetes, Jenkins, etc.)
- Version control systems (e.g., Git, SVN)
- Testing frameworks (e.g., Jest, Pytest, JUnit)
- Analytics tools (e.g., Tableau, Power BI, Excel)
- Project management tools (e.g., JIRA, Trello)
- Operating systems (e.g., Linux, Windows)
- Any other technical tools, frameworks, or platforms mentioned

Return them as a bullet-point list under this heading:
[Resume Skills]

Step 2: Extract ALL technical skills from the job descriptions using the same comprehensive categories as above.

Return them as a bullet-point list under this heading:
[JD Skills]

Step 3: Compare the two lists. Return only the skill keywords from [JD Skills] that are *not* present in [Resume Skills].
Consider variations of the same skill (e.g., "React.js" and "React" should be considered the same).
Group similar technologies (e.g., if resume has "MySQL" but JD requires "PostgreSQL", list it as a missing skill but note they have similar database experience).

Return them as a bullet-point list under this heading:
[Missing Skills]

Step 4: Calculate the percentage of missing skills using the formula:
(Missing Skills Count / Total JD Skills Count) * 100

Return this as a number with the label:
[Missing Percentage]

Resume:
\"\"\"
{resume_text}
\"\"\"

Job Descriptions:
\"\"\"
{combined_jd_text}
\"\"\"
"""

    response = model.generate_content(base_prompt)
    response_text = response.text.strip()

    # Initialize variables to store skills
    resume_skills = []
    job_skills = []
    missing_skills = []
    current_section = None

    # Parse the response text line by line
    for line in response_text.splitlines():
        line = line.strip()
        
        # Detect section headers
        if "[Resume Skills]" in line:
            current_section = "resume"
            continue
        elif "[JD Skills]" in line:
            current_section = "jd"
            continue
        elif "[Missing Skills]" in line:
            current_section = "missing"
            continue
        elif "[Missing Percentage]" in line:
            current_section = None
            continue
            
        # Skip empty lines or section headers
        if not line or line.startswith('[') or line.startswith('#'):
            continue
            
        # Extract skill from bullet point
        skill_match = re.match(r'^[-*]\s+(.+)$', line)
        if skill_match:
            skill = skill_match.group(1).strip()
            if current_section == "resume":
                resume_skills.append(skill)
            elif current_section == "jd":
                job_skills.append(skill)
            elif current_section == "missing":
                missing_skills.append(skill)

    return {
        "analysis_text": response_text,
        "resume_skills": list(set(resume_skills)),
        "job_skills": list(set(job_skills)),
        "missing_skills": list(set(missing_skills))
    }

def fetch_multiple_job_descriptions(domain, num_results=10):
    url = "https://jsearch.p.rapidapi.com/search"
    api_key = os.getenv("RAPID_API_KEY")

    headers = {
        "X-RapidAPI-Key": api_key,
        "X-RapidAPI-Host": "jsearch.p.rapidapi.com"
    }

    querystring = {
        "query": f"{domain} jobs",
        "page": "1",
        "num_pages": "1",
        "date_posted": "all"
    }

    try:
        response = requests.get(url, headers=headers, params=querystring)
        if response.status_code == 200:
            data = response.json()
            jobs = data.get("data", [])
            return [job.get("job_description", "") for job in jobs[:num_results]]
        else:
            print(f"Error fetching JD: {response.status_code}")
    except requests.RequestException as e:
        print(f"Request failed: {e}")
    return []

@app.route('/learning-resources', methods=['POST'])
def get_learning_resources():
    try:
        data = request.get_json()
        skills = data.get('skills', [])
        
        if not skills:
            return jsonify({"error": "No skills provided"}), 400
        
        results = {}
        for skill in skills:
            # Get project suggestions using Gemini
            project_ideas = suggest_projects(skill)
            # Get GitHub repositories
            repos = search_github_repos(skill)
            
            results[skill] = {
                "project_and_networking_ideas": project_ideas,
                "top_github_repositories": repos
            }
        
        return jsonify(results)
    except Exception as e:
        print(f"Error getting learning resources: {str(e)}")
        return jsonify({"error": str(e)}), 500

@app.route('/linkedin-profiles', methods=['POST'])
def get_linkedin_profiles():
    try:
        data = request.get_json()
        job_title = data.get('domain')
        location = data.get('location')
        
        if not job_title or not location:
            return jsonify({"error": "Job title and location are required"}), 400
            
        profiles = fetch_linkedin_profiles(job_title, location)
        return jsonify(profiles)
    except Exception as e:
        print(f"Error fetching LinkedIn profiles: {str(e)}")
        return jsonify({"error": str(e)}), 500

def suggest_projects(skill):
    try:
        model = genai.GenerativeModel("gemini-1.5-flash")
        prompt = f"""
Generate 3 practical real world impactful project ideas for someone learning {skill}.

For each project, provide:
1. A clear, descriptive project name that includes {skill}
2. A single sentence explaining what to build
3. 3-4 specific learning outcomes

Format each project exactly like this (without any markdown symbols, asterisks, or bullet points):

Project 1: [Project Name]
What to build: [A good description of what to build step by step]
Key Learning Outcomes: [3-4 specific skills or concepts, separated by semicolons]

Project 2: [Project Name]
What to build: [A good description of what to build step by step]
Key Learning Outcomes: [3-4 specific skills or concepts, separated by semicolons]

Project 3: [Project Name]
What to build: [A good description of what to build step by step]
Key Learning Outcomes: [3-4 specific skills or concepts, separated by semicolons]

Keep descriptions practical and focused on real-world applications.
"""
        response = model.generate_content(prompt)
        return response.text.strip()
    except Exception as e:
        print(f"Error generating project suggestions: {str(e)}")
        return "Failed to generate project suggestions"

def search_github_repos(skill, max_results=3):
    try:
        github_token = os.getenv("GITHUB_TOKEN")
        if not github_token:
            return []

        headers = {
            "Accept": "application/vnd.github+json",
            "Authorization": f"Bearer {github_token}",
            "X-GitHub-Api-Version": "2022-11-28"
        }

        params = {
            "q": f"{skill} in:readme in:description",
            "order": "desc",
            "per_page": max_results
        }

        response = requests.get(
            "https://api.github.com/search/repositories",
            headers=headers,
            params=params
        )

        if response.status_code == 200:
            data = response.json()
            return [{
                "name": repo["name"],
                "url": repo["html_url"],
                "description": repo.get("description", "No description available")
            } for repo in data.get("items", [])]
        else:
            print(f"GitHub API error: {response.status_code}")
            return []
    except Exception as e:
        print(f"Error searching GitHub repos: {str(e)}")
        return []

def fetch_linkedin_profiles(job_title, location, num_results=5):
    try:
        serp_api_key = os.getenv("SERP_API_KEY")
        if not serp_api_key:
            return []

        params = {
            "engine": "google",
            "q": f'site:linkedin.com/in/ "{job_title}" "{location}"',
            "api_key": serp_api_key,
            "num": num_results
        }

        response = requests.get("https://serpapi.com/search", params=params)
        
        if response.status_code == 200:
            data = response.json()
            organic_results = data.get("organic_results", [])
            
            return [{
                "title": result.get("title", ""),
                "link": result.get("link", ""),
                "snippet": result.get("snippet", "")
            } for result in organic_results]
        else:
            print(f"SerpAPI error: {response.status_code}")
            return []
    except Exception as e:
        print(f"Error fetching LinkedIn profiles: {str(e)}")
        return []

# Update API key check to include all required keys
print("Checking API Keys:")
print(f"GOOGLE_API_KEY present: {'GOOGLE_API_KEY' in os.environ}")
print(f"RAPID_API_KEY present: {'RAPID_API_KEY' in os.environ}")
print(f"GITHUB_TOKEN present: {'GITHUB_TOKEN' in os.environ}")
print(f"SERP_API_KEY present: {'SERP_API_KEY' in os.environ}")

if __name__ == '__main__':
    app.run(debug=True, port=5001)

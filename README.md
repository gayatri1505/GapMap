# GapMap - AI-Powered Skill Gap Analyzer

GapMap is an intelligent web application that analyzes resumes, identifies skill gaps, and provides personalized learning resources and networking opportunities.

## Features

- **Resume Analysis**: Upload PDF/DOC/DOCX resumes for instant skill analysis
- **Skill Gap Detection**: Compare your skills against job requirements
- **Learning Resources**: Get personalized project suggestions and GitHub repositories
- **Professional Networking**: Find relevant LinkedIn connections in your area
- **Modern UI**: Clean, responsive interface with a beautiful gradient theme

## Tech Stack

### Frontend
- React with TypeScript
- Vite for build tooling
- TailwindCSS for styling
- Shadcn/ui for UI components

### Backend
- Python Flask server
- Google Gemini AI for analysis
- Multiple API integrations (GitHub, LinkedIn, Job Search)
- PDF and DOC/DOCX text extraction

## Setup

### Prerequisites
- Node.js (v16 or higher)
- Python 3.8+
- API Keys:
  - Google Gemini AI
  - RapidAPI (for job search)
  - GitHub API
  - SerpAPI (for LinkedIn profiles)

### Backend Setup
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: .\venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env  # Create and configure your .env file
python app.py
```

### Frontend Setup
```bash
npm install
npm run dev
```

The application will be available at:
- Frontend: http://localhost:8081
- Backend: http://localhost:5001

## Environment Variables

Create a `.env` file in the backend directory with:
```
GOOGLE_API_KEY=your_gemini_api_key
RAPID_API_KEY=your_rapid_api_key
GITHUB_TOKEN=your_github_token
SERP_API_KEY=your_serp_api_key
```

## Usage

1. Upload your resume (PDF, DOC, or DOCX format)
2. Enter your target job domain
3. View the skill gap analysis
4. Select missing skills to get learning resources
5. Enter location to find relevant LinkedIn connections

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details. 
# 🔍 Digital Skeptic AI

<div align="center">

![Digital Skeptic AI](https://img.shields.io/badge/Digital%20Skeptic-AI%20Powered-blue?style=for-the-badge&logo=brain&logoColor=white)
![React](https://img.shields.io/badge/React-18.0+-61DAFB?style=for-the-badge&logo=react&logoColor=white)
![Gemini AI](https://img.shields.io/badge/Google-Gemini%20AI-4285F4?style=for-the-badge&logo=google&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)

**🚀 Empowering Critical Thinking in an Age of Information Overload**

[🌟 Live Demo](#) • [📖 Documentation](#documentation) • [🐛 Report Issues](#)

</div>

---

## 🎯 What is Digital Skeptic AI?

Digital Skeptic AI is your personal **critical thinking companion** that analyzes news articles for bias, claims, and credibility. It doesn't tell you what to think – it gives you the tools to think better by automating the initial skeptical analysis while encouraging independent verification.

### ⚡ Quick Demo

```bash
📰 Input: "https://example-news-site.com/breaking-news"
🤖 Gemini AI Analysis: *processes in seconds*
📊 Output: Comprehensive bias analysis with verification questions
```

---

## ✨ Core Features

### 🎯 **Core Claims Extractor**
- Automatically identifies 3-5 main factual claims from articles
- Separates verifiable facts from opinions and speculation
- Presents claims in clear, concise bullet points

### 🎭 **Language & Tone Analyzer**
- Detects emotional manipulation and loaded language
- Classifies articles as: Neutral, Persuasive, Opinion-based, or Sensationalized
- Identifies bias patterns in writing style and word choice

### 🚩 **Red Flag Detector**
- Spots overreliance on anonymous sources
- Identifies missing citations and unsupported claims
- Flags one-sided narratives and potential conflicts of interest
- Detects statistical manipulation or misleading data presentation

### ❓ **Smart Verification Generator**
- Creates 3-4 specific, actionable research questions
- Suggests independent verification methods
- Provides investigation roadmap for fact-checking

### 🔍 **Entity Recognition** (Bonus Feature)
- Identifies key people, organizations, and locations
- Suggests background research for each entity
- Flags potential funding sources and conflicts of interest

### 🎲 **Counter-Argument Simulator** (Bonus Feature)
- Shows how opposing viewpoints might interpret the story
- Highlights potential blind spots in the narrative
- Encourages perspective-taking and balanced analysis

---

## 🚀 Getting Started

### Prerequisites
```bash
✅ Node.js 16+ 
✅ npm or yarn
✅ Google Gemini API key
```

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/digital-skeptic-ai.git
   cd digital-skeptic-ai
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment setup**
   ```bash
   cp .env.example .env
   ```
   Add your Gemini API key to `.env`:
   ```
   VITE_GEMINI_API_KEY=your_gemini_api_key_here
   ```

4. **Run the application**
   ```bash
   npm run dev
   ```
   Open http://localhost:5173 in your browser.

---

## 🛠️ Technical Implementation

### Architecture Overview
- **Frontend**: React 18 with TypeScript
- **Styling**: Tailwind CSS with modern design system
- **AI Integration**: Google Gemini API for content analysis
- **Web Scraping**: Custom implementation with fallback options
- **State Management**: React hooks (useState, useEffect)

### Web Scraping Approach
The application attempts to fetch article content directly from URLs using:
1. **Primary method**: Direct fetch with CORS handling
2. **Fallback method**: Proxy service for CORS-restricted sites
3. **Alternative method**: Manual text input for blocked content

*Note: Some news sites may block automated scraping. In such cases, users can copy-paste article text directly into the application.*

### AI Prompt Engineering
The application uses carefully crafted prompts for each analysis type:
- **Claims Extraction**: Structured prompts that distinguish facts from opinions
- **Bias Detection**: Context-aware analysis of language patterns
- **Red Flag Identification**: Multi-criteria evaluation system
- **Question Generation**: Targeted verification strategies

---

## 📊 Output Format

The analysis generates a comprehensive **Critical Analysis Report** in Markdown format:

```markdown
# Critical Analysis Report for: [Article Title]

### Core Claims
• Claim 1: Specific factual assertion with context
• Claim 2: Statistical or numerical claim
• Claim 3: Policy or procedural claim

### Language & Tone Analysis
Classification and detailed explanation of the article's linguistic approach, 
identifying persuasive techniques and emotional appeals.

### Potential Red Flags
• Specific bias indicators found in the text
• Source credibility issues
• Missing context or opposing viewpoints

### Verification Questions
1. Targeted research question for independent fact-checking
2. Source validation inquiry
3. Context verification strategy
4. Alternative perspective exploration
```

---

## 🎮 How to Use

### Step 1: Input Article URL
- Paste any news article URL into the input field
- Supported sites: Most major news outlets (CNN, BBC, Reuters, etc.)
- Handles both free and some subscription-based content

### Step 2: AI Analysis Process
The application performs multi-stage analysis:
1. **Content Extraction**: Fetches and parses article text
2. **Claims Identification**: Uses Gemini AI to extract factual assertions
3. **Language Analysis**: Evaluates tone and bias indicators  
4. **Red Flag Detection**: Identifies credibility concerns
5. **Question Generation**: Creates verification strategies

### Step 3: Review Results
- **Visual indicators**: Color-coded bias and credibility scores
- **Downloadable report**: Export analysis as Markdown
- **Interactive sections**: Expandable analysis components

---

## 🧪 Testing & Quality Assurance

### Test Coverage
- URL validation and content extraction
- AI response parsing and error handling
- Edge cases: paywalled sites, malformed URLs, non-news content
- Cross-browser compatibility testing

### Known Limitations
- **CORS restrictions**: Some sites block cross-origin requests
- **Rate limiting**: Free Gemini API has usage limits
- **Language support**: Currently optimized for English content
- **Paywall content**: Limited access to subscription-only articles

---

## 📁 Project Structure

```
digital-skeptic-ai/
├── src/
│   ├── components/          # React components
│   │   ├── AnalysisReport.jsx
│   │   ├── ArticleInput.jsx
│   │   └── LoadingStates.jsx
│   ├── services/            # API and scraping logic
│   │   ├── geminiService.js
│   │   └── contentExtractor.js
│   ├── utils/               # Helper functions
│   │   └── promptTemplates.js
│   └── App.jsx              # Main application
├── public/                  # Static assets
├── .env.example            # Environment template
├── package.json            # Dependencies
└── README.md              # This file
```

---

## 🔧 Configuration

### Environment Variables
```bash
VITE_GEMINI_API_KEY=your_api_key_here          # Required: Gemini API key
VITE_CORS_PROXY_URL=https://cors-proxy.com     # Optional: Custom CORS proxy
VITE_DEBUG_MODE=false                          # Optional: Enable debug logging
```

### API Configuration
The application is configured to work with Google Gemini Pro model with optimal settings for text analysis tasks.

---

## 🐛 Troubleshooting

<details>
<summary><strong>CORS Issues with News Sites</strong></summary>

**Problem**: Browser blocks requests to news sites
**Solution**: Application automatically falls back to proxy service
**Alternative**: Copy article text and paste directly into the tool

</details>

<details>
<summary><strong>Gemini API Rate Limiting</strong></summary>

**Problem**: API requests being throttled
**Solution**: Application implements request queuing
**Prevention**: Monitor usage in Google Cloud Console

</details>

<details>
<summary><strong>Poor Analysis Quality</strong></summary>

**Problem**: Generic or inaccurate analysis results
**Solution**: Check article content quality and length
**Note**: Very short articles or press releases may yield limited analysis

</details>

---

## 📚 Documentation

### API Reference
- **Input**: Article URL (string)
- **Output**: Structured analysis object with all report sections
- **Error Handling**: Comprehensive error states with user guidance

### Prompt Engineering Details
The application uses sophisticated prompt templates optimized for:
- **Accuracy**: Factual claim extraction without hallucination
- **Nuance**: Subtle bias detection beyond obvious indicators  
- **Actionability**: Practical verification questions for users

---

## 🚀 Development & Deployment

### Local Development
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
```

### Deployment Options
- **Vercel**: Optimal for React applications
- **Netlify**: Simple deployment with build optimization
- **GitHub Pages**: Free hosting option

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

<div align="center">

**Made with React, Tailwind CSS, and Google Gemini AI**

*Fighting misinformation through critical thinking automation*

</div>

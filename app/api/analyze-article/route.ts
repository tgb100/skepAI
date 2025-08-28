import { type NextRequest, NextResponse } from "next/server"
import { GoogleGenerativeAI } from "@google/generative-ai"

export async function POST(request: NextRequest) {
  try {
    const { article } = await request.json()

    if (!article || !article.title || !article.content) {
      return NextResponse.json({ error: "Article data is required" }, { status: 400 })
    }

    const apiKey = process.env.GEMINI_API_KEY
    if (!apiKey) {
      return NextResponse.json({ error: "GEMINI_API_KEY environment variable is required" }, { status: 500 })
    }

    const genAI = new GoogleGenerativeAI(apiKey)
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" })

    const analysisPrompt = `
You are a professional media literacy expert and fact-checker. Analyze the following news article and provide a comprehensive analysis in JSON format.

Article Title: ${article.title}
Article Content: ${article.content}
${article.author ? `Author: ${article.author}` : ""}

Please provide analysis in this exact JSON structure:
{
  "claims": [
    {
      "claim": "string - main factual assertion",
      "confidence": "High|Medium|Low",
      "evidence": "string - supporting evidence found",
      "type": "Factual|Opinion|Statistical"
    }
  ],
  "tone": {
    "overall": "string - overall tone assessment",
    "sentiment": "Positive|Negative|Neutral",
    "objectivity": number (1-10 scale),
    "emotionalLanguage": ["array of emotional words used"],
    "biasIndicators": ["array of potential bias indicators"]
  },
  "redFlags": [
    {
      "flag": "string - red flag type",
      "severity": "High|Medium|Low",
      "description": "string - explanation"
    }
  ],
  "verificationQuestions": ["array of 5 critical questions readers should ask"],
  "entities": {
    "people": ["array of people mentioned"],
    "organizations": ["array of organizations"],
    "locations": ["array of locations"],
    "topics": ["array of main topics/themes"]
  },
  "counterArguments": [
    {
      "argument": "string - alternative perspective",
      "reasoning": "string - why this perspective matters"
    }
  ],
  "credibilityScore": number (1-10 scale),
  "recommendations": ["array of 4-5 actionable recommendations for readers"]
}

Focus on:
1. Identifying specific factual claims that can be verified
2. Detecting emotional language and potential bias
3. Recognizing missing perspectives or information gaps
4. Providing actionable verification steps
5. Assessing overall credibility based on journalistic standards

Return only valid JSON without any markdown formatting or additional text.
`

    const result = await model.generateContent(analysisPrompt)
    const response = await result.response
    const analysisText = response.text()

    // Parse the JSON response
    let analysis
    try {
      // Clean the response in case it has markdown formatting
      const cleanedResponse = analysisText.replace(/```json\n?|\n?```/g, "").trim()
      analysis = JSON.parse(cleanedResponse)
    } catch (parseError) {
      console.error("Failed to parse AI response:", parseError)
      console.error("Raw response:", analysisText)
      return NextResponse.json({ error: "Failed to parse AI analysis response" }, { status: 500 })
    }

    return NextResponse.json({ analysis })
  } catch (error) {
    console.error("Analysis error:", error)
    return NextResponse.json({ error: "Failed to analyze article" }, { status: 500 })
  }
}

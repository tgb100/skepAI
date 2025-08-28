"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  AlertCircle,
  Search,
  Brain,
  FileText,
  Shield,
  HelpCircle,
  MessageSquare,
  ExternalLink,
  ChevronDown,
  Copy,
  Users,
  MapPin,
  Building,
  Hash,
  Download,
  Share2,
  Printer,
  CheckCircle2,
  Eye,
  AlertTriangle,
} from "lucide-react"

interface ArticleData {
  title: string
  content: string
  author?: string
  url: string
  preview: string
}

interface AnalysisData {
  claims: Array<{
    claim: string
    confidence: string
    evidence: string
    type: string
  }>
  tone: {
    overall: string
    sentiment: string
    objectivity: number
    emotionalLanguage: string[]
    biasIndicators: string[]
  }
  redFlags: Array<{
    flag: string
    severity: string
    description: string
  }>
  verificationQuestions: string[]
  entities: {
    people: string[]
    organizations: string[]
    locations: string[]
    topics: string[]
  }
  counterArguments: Array<{
    argument: string
    reasoning: string
  }>
  credibilityScore: number
  recommendations: string[]
}

export default function DigitalSkepticAI() {
  const [url, setUrl] = useState("")
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [article, setArticle] = useState<ArticleData | null>(null)
  const [analysis, setAnalysis] = useState<AnalysisData | null>(null)
  const [error, setError] = useState("")
  const [copyFeedback, setCopyFeedback] = useState<string | null>(null)

  const handleAnalyze = async () => {
    if (!url.trim()) {
      setError("Please enter a valid URL")
      return
    }

    setError("")
    setIsAnalyzing(true)
    setArticle(null)
    setAnalysis(null)

    try {
      const fetchResponse = await fetch("/api/fetch-article", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url: url.trim() }),
      })

      const articleData = await fetchResponse.json()

      if (!fetchResponse.ok) {
        throw new Error(articleData.error || "Failed to fetch article")
      }

      setArticle(articleData)

      const analysisResponse = await fetch("/api/analyze-article", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ article: articleData }),
      })

      const analysisData = await analysisResponse.json()

      if (!analysisResponse.ok) {
        throw new Error(analysisData.error || "Failed to analyze article")
      }

      setAnalysis(analysisData.analysis)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unexpected error occurred")
    } finally {
      setIsAnalyzing(false)
    }
  }

  const copyToClipboard = async (text: string, label?: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopyFeedback(label || "Copied!")
      setTimeout(() => setCopyFeedback(null), 2000)
    } catch (err) {
      console.error("Failed to copy:", err)
    }
  }

  const exportAsJSON = () => {
    if (!article || !analysis) return

    const exportData = {
      article,
      analysis,
      exportedAt: new Date().toISOString(),
      url: article.url,
    }

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `digital-skeptic-analysis-${new Date().toISOString().split("T")[0]}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const exportAsText = () => {
    if (!article || !analysis) return

    let textContent = `DIGITAL SKEPTIC AI - ANALYSIS REPORT\n`
    textContent += `Generated: ${new Date().toLocaleString()}\n`
    textContent += `${"=".repeat(50)}\n\n`

    textContent += `ARTICLE INFORMATION\n`
    textContent += `Title: ${article.title}\n`
    textContent += `Author: ${article.author || "Not specified"}\n`
    textContent += `URL: ${article.url}\n`
    textContent += `Content Length: ${article.content.length.toLocaleString()} characters\n\n`

    textContent += `CREDIBILITY SCORE: ${analysis.credibilityScore}/10\n\n`

    textContent += `CORE CLAIMS\n`
    textContent += `${"-".repeat(20)}\n`
    analysis.claims.forEach((claim, i) => {
      textContent += `${i + 1}. ${claim.claim}\n`
      textContent += `   Confidence: ${claim.confidence} | Type: ${claim.type}\n`
      textContent += `   Evidence: ${claim.evidence}\n\n`
    })

    textContent += `TONE ANALYSIS\n`
    textContent += `${"-".repeat(20)}\n`
    textContent += `Overall: ${analysis.tone.overall}\n`
    textContent += `Sentiment: ${analysis.tone.sentiment}\n`
    textContent += `Objectivity: ${analysis.tone.objectivity}/10\n`
    textContent += `Emotional Language: ${analysis.tone.emotionalLanguage.join(", ")}\n`
    textContent += `Bias Indicators: ${analysis.tone.biasIndicators.join(", ")}\n\n`

    textContent += `RED FLAGS\n`
    textContent += `${"-".repeat(20)}\n`
    analysis.redFlags.forEach((flag, i) => {
      textContent += `${i + 1}. ${flag.flag} (${flag.severity})\n`
      textContent += `   ${flag.description}\n\n`
    })

    textContent += `VERIFICATION QUESTIONS\n`
    textContent += `${"-".repeat(20)}\n`
    analysis.verificationQuestions.forEach((question, i) => {
      textContent += `${i + 1}. ${question}\n`
    })
    textContent += `\n`

    textContent += `RECOMMENDATIONS\n`
    textContent += `${"-".repeat(20)}\n`
    analysis.recommendations.forEach((rec, i) => {
      textContent += `${i + 1}. ${rec}\n`
    })

    const blob = new Blob([textContent], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `digital-skeptic-analysis-${new Date().toISOString().split("T")[0]}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const copyFullAnalysis = () => {
    if (!article || !analysis) return

    let fullText = `Digital Skeptic AI Analysis\n\n`
    fullText += `Article: ${article.title}\n`
    fullText += `URL: ${article.url}\n`
    fullText += `Credibility Score: ${analysis.credibilityScore}/10\n\n`

    fullText += `Key Claims:\n`
    analysis.claims.forEach((claim, i) => {
      fullText += `• ${claim.claim} (${claim.confidence} confidence)\n`
    })

    fullText += `\nVerification Questions:\n`
    analysis.verificationQuestions.forEach((q, i) => {
      fullText += `• ${q}\n`
    })

    fullText += `\nRecommendations:\n`
    analysis.recommendations.forEach((rec, i) => {
      fullText += `• ${rec}\n`
    })

    copyToClipboard(fullText, "Full analysis copied!")
  }

  const shareAnalysis = async () => {
    if (!article || !analysis) return

    const shareText = `I analyzed "${article.title}" with Digital Skeptic AI. Credibility Score: ${analysis.credibilityScore}/10. Key findings: ${analysis.claims[0]?.claim || "Multiple claims identified"}`

    if (navigator.share) {
      try {
        await navigator.share({
          title: "Digital Skeptic AI Analysis",
          text: shareText,
          url: window.location.href,
        })
      } catch (err) {
        copyToClipboard(shareText, "Share text copied!")
      }
    } else {
      copyToClipboard(shareText, "Share text copied!")
    }
  }

  const printAnalysis = () => {
    window.print()
  }

  const getSeverityColor = (severity: string) => {
    switch (severity.toLowerCase()) {
      case "high":
        return "destructive"
      case "medium":
        return "secondary"
      case "low":
        return "outline"
      default:
        return "outline"
    }
  }

  const getConfidenceColor = (confidence: string) => {
    switch (confidence.toLowerCase()) {
      case "high":
        return "default"
      case "medium":
        return "secondary"
      case "low":
        return "outline"
      default:
        return "outline"
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-100/50 dark:from-slate-900 dark:via-slate-800 dark:to-indigo-950 relative overflow-hidden">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 via-indigo-600/5 to-purple-600/5 animate-gradient-shift" />
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-blue-400/30 rounded-full animate-float-slow" />
          <div className="absolute top-3/4 right-1/4 w-1 h-1 bg-indigo-400/40 rounded-full animate-float-medium" />
          <div className="absolute top-1/2 left-3/4 w-1.5 h-1.5 bg-purple-400/30 rounded-full animate-float-fast" />
          <div className="absolute bottom-1/4 left-1/2 w-1 h-1 bg-cyan-400/40 rounded-full animate-float-slow" />
        </div>
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fillRule='evenodd'%3E%3Cg fill='%233b82f6' fillOpacity='0.03'%3E%3Ccircle cx='30' cy='30' r='1.5'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
      </div>

      <header className="relative border-b border-white/10 backdrop-blur-xl bg-white/5 dark:bg-slate-900/5 print:border-none shadow-lg shadow-slate-900/5">
        <div className="container mx-auto px-6 py-8">
          <div className="flex items-center gap-4 mb-3 animate-fade-in">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl blur-lg opacity-30 animate-pulse" />
              <div className="relative flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl shadow-xl shadow-blue-500/25 transform hover:scale-110 transition-all duration-500">
                <Brain className="w-8 h-8 text-white animate-pulse" />
              </div>
            </div>
            <div>
              <h1 className="text-5xl font-bold bg-gradient-to-r from-slate-800 via-blue-600 to-indigo-600 dark:from-white dark:via-blue-300 dark:to-indigo-300 bg-clip-text text-transparent tracking-tight">
                Digital Skeptic AI
              </h1>
              <p className="text-slate-600 dark:text-slate-300 text-xl font-medium mt-1 animate-slide-up">
                Empowering Critical Thinking in an Age of Information Overload
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="relative container mx-auto px-6 py-12 max-w-5xl">
        <Card className="mb-12 print:hidden backdrop-blur-xl bg-white/80 dark:bg-slate-800/80 border-white/20 shadow-2xl shadow-slate-900/10 hover:shadow-3xl hover:shadow-blue-500/10 transition-all duration-700 transform hover:-translate-y-2 hover:scale-[1.02]">
          <CardHeader className="pb-6">
            <CardTitle className="flex items-center gap-3 text-2xl font-semibold">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl blur-md opacity-30" />
                <div className="relative p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl shadow-lg">
                  <Search className="w-6 h-6 text-white" />
                </div>
              </div>
              Analyze News Article
            </CardTitle>
            <CardDescription className="text-slate-600 dark:text-slate-300 text-lg">
              Paste a news article URL below to get a comprehensive critical analysis
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="flex gap-4">
              <div className="flex-1 relative group">
                <Input
                  type="url"
                  placeholder="https://example.com/news-article"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  className="h-14 text-lg backdrop-blur-sm bg-white/60 dark:bg-slate-700/60 border-white/40 focus:border-blue-400 focus:ring-4 focus:ring-blue-400/20 transition-all duration-300 rounded-xl shadow-lg group-hover:shadow-xl"
                  disabled={isAnalyzing}
                />
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500/10 to-indigo-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
              </div>
              <Button
                onClick={handleAnalyze}
                disabled={isAnalyzing || !url.trim()}
                className="h-14 px-8 text-lg font-semibold bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-xl shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/30 transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {isAnalyzing ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-current mr-3" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Eye className="w-5 h-5 mr-2" />
                    Analyze Article
                  </>
                )}
              </Button>
            </div>
            {error && (
              <div className="flex items-center gap-3 mt-4 p-4 text-red-600 bg-red-50/80 dark:bg-red-900/20 rounded-xl border border-red-200/50 dark:border-red-800/50 animate-shake backdrop-blur-sm">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <span className="font-medium">{error}</span>
              </div>
            )}
          </CardContent>
        </Card>

        {analysis && (
          <Card className="mb-12 print:hidden backdrop-blur-xl bg-white/80 dark:bg-slate-800/80 border-white/20 shadow-2xl shadow-slate-900/10 animate-fade-in-up">
            <CardHeader className="pb-6">
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-3 text-xl font-semibold">
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl blur-md opacity-30" />
                    <div className="relative p-3 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl shadow-lg">
                      <Download className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  Export & Share Analysis
                </div>
                {copyFeedback && (
                  <div className="flex items-center gap-2 text-emerald-600 font-medium animate-bounce bg-emerald-50/80 dark:bg-emerald-900/20 px-4 py-2 rounded-xl backdrop-blur-sm">
                    <CheckCircle2 className="w-5 h-5" />
                    {copyFeedback}
                  </div>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="flex flex-wrap gap-4">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      className="h-12 px-6 font-medium backdrop-blur-sm bg-white/60 dark:bg-slate-700/60 border-white/40 hover:bg-white/80 dark:hover:bg-slate-600/80 transition-all duration-300 rounded-xl shadow-lg hover:shadow-xl hover:scale-105"
                    >
                      <Download className="w-5 h-5 mr-2" />
                      Export
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="backdrop-blur-xl bg-white/95 dark:bg-slate-800/95 border-white/20 shadow-2xl rounded-xl">
                    <DropdownMenuItem
                      onClick={exportAsJSON}
                      className="hover:bg-white/60 dark:hover:bg-slate-700/60 rounded-lg m-1"
                    >
                      <FileText className="w-4 h-4 mr-2" />
                      Export as JSON
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={exportAsText}
                      className="hover:bg-white/60 dark:hover:bg-slate-700/60 rounded-lg m-1"
                    >
                      <FileText className="w-4 h-4 mr-2" />
                      Export as Text
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                <Button
                  variant="outline"
                  onClick={copyFullAnalysis}
                  className="h-12 px-6 font-medium backdrop-blur-sm bg-white/60 dark:bg-slate-700/60 border-white/40 hover:bg-white/80 dark:hover:bg-slate-600/80 transition-all duration-300 rounded-xl shadow-lg hover:shadow-xl hover:scale-105"
                >
                  <Copy className="w-5 h-5 mr-2" />
                  Copy Full Analysis
                </Button>

                <Button
                  variant="outline"
                  onClick={shareAnalysis}
                  className="h-12 px-6 font-medium backdrop-blur-sm bg-white/60 dark:bg-slate-700/60 border-white/40 hover:bg-white/80 dark:hover:bg-slate-600/80 transition-all duration-300 rounded-xl shadow-lg hover:shadow-xl hover:scale-105"
                >
                  <Share2 className="w-5 h-5 mr-2" />
                  Share
                </Button>

                <Button
                  variant="outline"
                  onClick={printAnalysis}
                  className="h-12 px-6 font-medium backdrop-blur-sm bg-white/60 dark:bg-slate-700/60 border-white/40 hover:bg-white/80 dark:hover:bg-slate-600/80 transition-all duration-300 rounded-xl shadow-lg hover:shadow-xl hover:scale-105"
                >
                  <Printer className="w-5 h-5 mr-2" />
                  Print
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {article && (
          <Card className="mb-12 backdrop-blur-xl bg-white/80 dark:bg-slate-800/80 border-white/20 shadow-2xl shadow-slate-900/10 animate-fade-in-up hover:shadow-3xl transition-all duration-500">
            <CardHeader className="pb-6">
              <CardTitle className="flex items-center gap-3 text-xl font-semibold">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl blur-md opacity-30" />
                  <div className="relative p-3 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl shadow-lg">
                    <FileText className="w-6 h-6 text-white" />
                  </div>
                </div>
                Article Preview
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-6">
                <div className="p-6 bg-gradient-to-br from-white/60 to-slate-50/60 dark:from-slate-700/60 dark:to-slate-800/60 rounded-2xl backdrop-blur-sm border border-white/30">
                  <h3 className="font-bold text-2xl mb-2 bg-gradient-to-r from-slate-800 to-purple-600 dark:from-white dark:to-purple-300 bg-clip-text text-transparent leading-tight">
                    {article.title}
                  </h3>
                  {article.author && (
                    <p className="text-slate-600 dark:text-slate-300 font-medium mb-4">By {article.author}</p>
                  )}
                  <p className="text-slate-700 dark:text-slate-200 leading-relaxed text-lg">{article.preview}</p>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 text-slate-500 dark:text-slate-400 print:hidden">
                    <ExternalLink className="w-5 h-5" />
                    <a
                      href={article.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:underline hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-300 font-medium"
                    >
                      View original article
                    </a>
                  </div>
                  <div className="text-sm text-slate-500 dark:text-slate-400 font-medium">
                    {article.content.length.toLocaleString()} characters
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {analysis && (
          <div className="space-y-8">
            <Card className="backdrop-blur-xl bg-white/80 dark:bg-slate-800/80 border-white/20 shadow-2xl shadow-slate-900/10 animate-fade-in-up hover:shadow-3xl transition-all duration-500">
              <CardHeader className="pb-6">
                <CardTitle className="flex items-center gap-3 text-2xl font-semibold">
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl blur-md opacity-30" />
                    <div className="relative p-3 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl shadow-lg">
                      <Shield className="w-7 h-7 text-white" />
                    </div>
                  </div>
                  Overall Credibility Score
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex items-center gap-8">
                  <div className="relative">
                    <div className="text-6xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent animate-pulse">
                      {analysis.credibilityScore}
                    </div>
                    <div className="text-2xl font-semibold text-slate-500 dark:text-slate-400">/10</div>
                  </div>
                  <div className="flex-1">
                    <div className="w-full bg-slate-200/60 dark:bg-slate-700/60 rounded-full h-4 backdrop-blur-sm shadow-inner">
                      <div
                        className="bg-gradient-to-r from-emerald-500 to-teal-500 h-4 rounded-full transition-all duration-2000 ease-out shadow-lg relative overflow-hidden"
                        style={{ width: `${analysis.credibilityScore * 10}%` }}
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent animate-shimmer" />
                      </div>
                    </div>
                    <div className="mt-3 text-slate-600 dark:text-slate-300 font-medium">
                      {analysis.credibilityScore >= 8
                        ? "High Credibility"
                        : analysis.credibilityScore >= 6
                          ? "Moderate Credibility"
                          : analysis.credibilityScore >= 4
                            ? "Low Credibility"
                            : "Very Low Credibility"}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Collapsible>
              <Card className="backdrop-blur-xl bg-white/80 dark:bg-slate-800/80 border-white/20 shadow-2xl shadow-slate-900/10 hover:shadow-3xl transition-all duration-500 animate-fade-in-up group">
                <CollapsibleTrigger asChild>
                  <CardHeader className="cursor-pointer hover:bg-white/40 dark:hover:bg-slate-700/40 transition-all duration-300 rounded-t-2xl pb-6">
                    <CardTitle className="flex items-center justify-between text-xl font-semibold">
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl blur-md opacity-30" />
                          <div className="relative p-3 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl shadow-lg">
                            <FileText className="w-6 h-6 text-white" />
                          </div>
                        </div>
                        Core Claims Extraction
                      </div>
                      <ChevronDown className="w-6 h-6 print:hidden transition-transform duration-300 group-data-[state=open]:rotate-180 text-slate-500 dark:text-slate-400" />
                    </CardTitle>
                  </CardHeader>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <CardContent className="pt-0">
                    <div className="space-y-6">
                      {analysis.claims.map((claim, index) => (
                        <div
                          key={index}
                          className="border border-white/40 rounded-2xl p-6 backdrop-blur-sm bg-white/40 dark:bg-slate-700/40 hover:bg-white/60 dark:hover:bg-slate-600/60 transition-all duration-300 transform hover:scale-[1.02] shadow-lg hover:shadow-xl"
                        >
                          <div className="flex items-start justify-between gap-4 mb-4">
                            <p className="font-semibold text-lg leading-relaxed">{claim.claim}</p>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => copyToClipboard(claim.claim, "Claim copied!")}
                              className="print:hidden hover:bg-white/60 dark:hover:bg-slate-600/60 transition-all duration-300 hover:scale-110 rounded-xl"
                            >
                              <Copy className="w-5 h-5" />
                            </Button>
                          </div>
                          <div className="flex gap-3 mb-4">
                            <Badge
                              variant={getConfidenceColor(claim.confidence)}
                              className="backdrop-blur-sm bg-white/60 dark:bg-slate-700/60 font-medium px-3 py-1 text-sm"
                            >
                              {claim.confidence} Confidence
                            </Badge>
                            <Badge
                              variant="outline"
                              className="backdrop-blur-sm bg-white/40 dark:bg-slate-700/40 border-white/50 font-medium px-3 py-1 text-sm"
                            >
                              {claim.type}
                            </Badge>
                          </div>
                          <p className="text-slate-600 dark:text-slate-300 leading-relaxed">{claim.evidence}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </CollapsibleContent>
              </Card>
            </Collapsible>

            {/* Language & Tone Analysis */}
            <Collapsible>
              <Card className="backdrop-blur-xl bg-white/80 dark:bg-slate-800/80 border-white/20 shadow-2xl shadow-slate-900/10 hover:shadow-3xl transition-all duration-500 animate-fade-in-up">
                <CollapsibleTrigger asChild>
                  <CardHeader className="cursor-pointer hover:bg-white/20 dark:hover:bg-slate-700/20 transition-all duration-300 rounded-t-lg">
                    <CardTitle className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="p-2 bg-gradient-to-br from-orange-500 to-red-600 rounded-lg">
                          <MessageSquare className="w-5 h-5 text-white" />
                        </div>
                        Language & Tone Analysis
                      </div>
                      <ChevronDown className="w-4 h-4 print:hidden transition-transform duration-300 group-data-[state=open]:rotate-180" />
                    </CardTitle>
                  </CardHeader>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <CardContent>
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="backdrop-blur-sm bg-white/30 dark:bg-slate-700/30 rounded-lg p-4">
                        <h4 className="font-medium mb-2">Overall Assessment</h4>
                        <p className="text-sm text-slate-600 dark:text-slate-300 mb-1">Tone: {analysis.tone.overall}</p>
                        <p className="text-sm text-slate-600 dark:text-slate-300 mb-1">
                          Sentiment: {analysis.tone.sentiment}
                        </p>
                        <p className="text-sm text-slate-600 dark:text-slate-300">
                          Objectivity: {analysis.tone.objectivity}/10
                        </p>
                      </div>
                      <div className="backdrop-blur-sm bg-white/30 dark:bg-slate-700/30 rounded-lg p-4">
                        <h4 className="font-medium mb-2">Emotional Language</h4>
                        <div className="flex flex-wrap gap-1">
                          {analysis.tone.emotionalLanguage.map((word, index) => (
                            <Badge
                              key={index}
                              variant="secondary"
                              className="text-xs backdrop-blur-sm bg-white/50 dark:bg-slate-600/50 hover:scale-105 transition-transform duration-200"
                            >
                              {word}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="mt-4 backdrop-blur-sm bg-white/30 dark:bg-slate-700/30 rounded-lg p-4">
                      <h4 className="font-medium mb-2">Bias Indicators</h4>
                      <ul className="space-y-1">
                        {analysis.tone.biasIndicators.map((indicator, index) => (
                          <li
                            key={index}
                            className="text-sm text-slate-600 dark:text-slate-300 flex items-center gap-2"
                          >
                            <div className="w-1.5 h-1.5 bg-gradient-to-r from-orange-500 to-red-500 rounded-full animate-pulse" />
                            {indicator}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </CardContent>
                </CollapsibleContent>
              </Card>
            </Collapsible>

            <Collapsible>
              <Card className="backdrop-blur-xl bg-white/80 dark:bg-slate-800/80 border-white/20 shadow-2xl shadow-slate-900/10 hover:shadow-3xl transition-all duration-500 animate-fade-in-up group">
                <CollapsibleTrigger asChild>
                  <CardHeader className="cursor-pointer hover:bg-white/40 dark:hover:bg-slate-700/40 transition-all duration-300 rounded-t-2xl pb-6">
                    <CardTitle className="flex items-center justify-between text-xl font-semibold">
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <div className="absolute inset-0 bg-gradient-to-br from-red-500 to-pink-600 rounded-xl blur-md opacity-30" />
                          <div className="relative p-3 bg-gradient-to-br from-red-500 to-pink-600 rounded-xl shadow-lg">
                            <AlertTriangle className="w-6 h-6 text-white" />
                          </div>
                        </div>
                        Red Flags Detection
                      </div>
                      <ChevronDown className="w-6 h-6 print:hidden transition-transform duration-300 group-data-[state=open]:rotate-180 text-slate-500 dark:text-slate-400" />
                    </CardTitle>
                  </CardHeader>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <CardContent className="pt-0">
                    <div className="space-y-4">
                      {analysis.redFlags.map((flag, index) => (
                        <div
                          key={index}
                          className="border border-white/40 rounded-2xl p-6 backdrop-blur-sm bg-white/40 dark:bg-slate-700/40 hover:bg-white/60 dark:hover:bg-slate-600/60 transition-all duration-300 transform hover:scale-[1.02] shadow-lg hover:shadow-xl"
                        >
                          <div className="flex items-center gap-3 mb-4">
                            <h4 className="font-semibold text-lg">{flag.flag}</h4>
                            <Badge
                              variant={getSeverityColor(flag.severity)}
                              className="backdrop-blur-sm font-medium px-3 py-1"
                            >
                              {flag.severity}
                            </Badge>
                          </div>
                          <p className="text-slate-600 dark:text-slate-300 leading-relaxed">{flag.description}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </CollapsibleContent>
              </Card>
            </Collapsible>

            {/* Verification Questions */}
            <Collapsible>
              <Card className="backdrop-blur-xl bg-white/70 dark:bg-slate-800/70 border-white/20 shadow-2xl shadow-slate-900/10 hover:shadow-3xl transition-all duration-500 animate-fade-in-up">
                <CollapsibleTrigger asChild>
                  <CardHeader className="cursor-pointer hover:bg-white/20 dark:hover:bg-slate-700/20 transition-all duration-300 rounded-t-lg">
                    <CardTitle className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg">
                          <HelpCircle className="w-5 h-5 text-white" />
                        </div>
                        Verification Questions
                      </div>
                      <ChevronDown className="w-4 h-4 print:hidden transition-transform duration-300 group-data-[state=open]:rotate-180" />
                    </CardTitle>
                  </CardHeader>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <CardContent>
                    <div className="space-y-3">
                      {analysis.verificationQuestions.map((question, index) => (
                        <div
                          key={index}
                          className="flex items-start gap-3 p-3 border border-white/30 rounded-lg backdrop-blur-sm bg-white/30 dark:bg-slate-700/30 hover:bg-white/40 dark:hover:bg-slate-600/40 transition-all duration-300 transform hover:scale-[1.01]"
                        >
                          <div className="w-6 h-6 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 shadow-lg">
                            <span className="text-xs font-medium text-white">{index + 1}</span>
                          </div>
                          <p className="text-sm">{question}</p>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => copyToClipboard(question, "Question copied!")}
                            className="ml-auto flex-shrink-0 print:hidden hover:bg-white/50 dark:hover:bg-slate-600/50 transition-all duration-300 hover:scale-110"
                          >
                            <Copy className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </CollapsibleContent>
              </Card>
            </Collapsible>

            {/* Entity Recognition */}
            <Collapsible>
              <Card className="backdrop-blur-xl bg-white/70 dark:bg-slate-800/70 border-white/20 shadow-2xl shadow-slate-900/10 hover:shadow-3xl transition-all duration-500 animate-fade-in-up">
                <CollapsibleTrigger asChild>
                  <CardHeader className="cursor-pointer hover:bg-white/20 dark:hover:bg-slate-700/20 transition-all duration-300 rounded-t-lg">
                    <CardTitle className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="p-2 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-lg">
                          <Hash className="w-5 h-5 text-white" />
                        </div>
                        Entity Recognition
                      </div>
                      <ChevronDown className="w-4 h-4 print:hidden transition-transform duration-300 group-data-[state=open]:rotate-180" />
                    </CardTitle>
                  </CardHeader>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <CardContent>
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="backdrop-blur-sm bg-white/30 dark:bg-slate-700/30 rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <Users className="w-4 h-4 text-blue-600" />
                          <h4 className="font-medium">People</h4>
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {analysis.entities.people.map((person, index) => (
                            <Badge
                              key={index}
                              variant="outline"
                              className="text-xs backdrop-blur-sm bg-white/50 dark:bg-slate-600/50 border-white/40 hover:scale-105 transition-transform duration-200"
                            >
                              {person}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div className="backdrop-blur-sm bg-white/30 dark:bg-slate-700/30 rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <Building className="w-4 h-4 text-green-600" />
                          <h4 className="font-medium">Organizations</h4>
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {analysis.entities.organizations.map((org, index) => (
                            <Badge
                              key={index}
                              variant="outline"
                              className="text-xs backdrop-blur-sm bg-white/50 dark:bg-slate-600/50 border-white/40 hover:scale-105 transition-transform duration-200"
                            >
                              {org}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div className="backdrop-blur-sm bg-white/30 dark:bg-slate-700/30 rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <MapPin className="w-4 h-4 text-red-600" />
                          <h4 className="font-medium">Locations</h4>
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {analysis.entities.locations.map((location, index) => (
                            <Badge
                              key={index}
                              variant="outline"
                              className="text-xs backdrop-blur-sm bg-white/50 dark:bg-slate-600/50 border-white/40 hover:scale-105 transition-transform duration-200"
                            >
                              {location}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div className="backdrop-blur-sm bg-white/30 dark:bg-slate-700/30 rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <Hash className="w-4 h-4 text-purple-600" />
                          <h4 className="font-medium">Topics</h4>
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {analysis.entities.topics.map((topic, index) => (
                            <Badge
                              key={index}
                              variant="outline"
                              className="text-xs backdrop-blur-sm bg-white/50 dark:bg-slate-600/50 border-white/40 hover:scale-105 transition-transform duration-200"
                            >
                              {topic}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </CollapsibleContent>
              </Card>
            </Collapsible>

            {/* Counter Arguments */}
            <Collapsible>
              <Card className="backdrop-blur-xl bg-white/70 dark:bg-slate-800/70 border-white/20 shadow-2xl shadow-slate-900/10 hover:shadow-3xl transition-all duration-500 animate-fade-in-up">
                <CollapsibleTrigger asChild>
                  <CardHeader className="cursor-pointer hover:bg-white/20 dark:hover:bg-slate-700/20 transition-all duration-300 rounded-t-lg">
                    <CardTitle className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="p-2 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-lg">
                          <MessageSquare className="w-5 h-5 text-white" />
                        </div>
                        Counter-Argument Simulation
                      </div>
                      <ChevronDown className="w-4 h-4 print:hidden transition-transform duration-300 group-data-[state=open]:rotate-180" />
                    </CardTitle>
                  </CardHeader>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <CardContent>
                    <div className="space-y-4">
                      {analysis.counterArguments.map((counter, index) => (
                        <div
                          key={index}
                          className="border border-white/30 rounded-lg p-4 backdrop-blur-sm bg-white/30 dark:bg-slate-700/30 hover:bg-white/40 dark:hover:bg-slate-600/40 transition-all duration-300 transform hover:scale-[1.02]"
                        >
                          <h4 className="font-medium mb-2">{counter.argument}</h4>
                          <p className="text-sm text-slate-600 dark:text-slate-300">{counter.reasoning}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </CollapsibleContent>
              </Card>
            </Collapsible>

            <Card className="backdrop-blur-xl bg-white/80 dark:bg-slate-800/80 border-white/20 shadow-2xl shadow-slate-900/10 animate-fade-in-up hover:shadow-3xl transition-all duration-500">
              <CardHeader className="pb-6">
                <CardTitle className="flex items-center gap-3 text-xl font-semibold">
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-violet-500 to-purple-600 rounded-xl blur-md opacity-30" />
                    <div className="relative p-3 bg-gradient-to-br from-violet-500 to-purple-600 rounded-xl shadow-lg">
                      <Brain className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  Recommendations for Further Investigation
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <ul className="space-y-4">
                  {analysis.recommendations.map((recommendation, index) => (
                    <li
                      key={index}
                      className="flex items-start gap-4 p-4 rounded-2xl backdrop-blur-sm bg-white/40 dark:bg-slate-700/40 hover:bg-white/60 dark:hover:bg-slate-600/60 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-[1.01]"
                    >
                      <div className="w-2 h-2 bg-gradient-to-r from-violet-500 to-purple-500 rounded-full mt-3 flex-shrink-0 animate-pulse" />
                      <span className="leading-relaxed font-medium">{recommendation}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Analysis Results Placeholder */}
        {!article && !analysis && (
          <div className="grid gap-6 md:grid-cols-2">
            <Card className="backdrop-blur-xl bg-white/70 dark:bg-slate-800/70 border-white/20 shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-1 hover:scale-105">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <div className="p-2 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-lg">
                    <FileText className="w-5 h-5 text-white" />
                  </div>
                  Core Claims Extraction
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600 dark:text-slate-300">
                  Identify and list the main factual claims made in the article
                </p>
              </CardContent>
            </Card>

            <Card className="backdrop-blur-xl bg-white/70 dark:bg-slate-800/70 border-white/20 shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-1 hover:scale-105">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <div className="p-2 bg-gradient-to-br from-orange-500 to-red-600 rounded-lg">
                    <MessageSquare className="w-5 h-5 text-white" />
                  </div>
                  Language & Tone Analysis
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600 dark:text-slate-300">
                  Analyze the writing style, tone, and emotional language used
                </p>
              </CardContent>
            </Card>

            <Card className="backdrop-blur-xl bg-white/70 dark:bg-slate-800/70 border-white/20 shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-1 hover:scale-105">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <div className="p-2 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg">
                    <Shield className="w-5 h-5 text-white" />
                  </div>
                  Red Flags Detection
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600 dark:text-slate-300">
                  Identify potential bias indicators and credibility concerns
                </p>
              </CardContent>
            </Card>

            <Card className="backdrop-blur-xl bg-white/70 dark:bg-slate-800/70 border-white/20 shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-1 hover:scale-105">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg">
                    <HelpCircle className="w-5 h-5 text-white" />
                  </div>
                  Verification Questions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600 dark:text-slate-300">
                  Generate specific questions to help verify the article's claims
                </p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Disclaimer */}
        <Card className="mt-8 border-white/20 backdrop-blur-xl bg-white/60 dark:bg-slate-800/60 shadow-lg">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-slate-600 dark:text-slate-300">
                <p className="font-medium mb-1">Important Disclaimer</p>
                <p>
                  This tool is designed to aid critical thinking and does not determine the truth or falsehood of
                  claims. Always verify information through multiple reliable sources and consult subject matter experts
                  when needed.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Media Literacy Info */}
        <Card className="mt-4 backdrop-blur-xl bg-gradient-to-br from-blue-50/80 to-indigo-50/80 dark:from-slate-800/80 dark:to-indigo-900/80 border-white/20 shadow-lg print:hidden">
          <CardHeader>
            <CardTitle className="text-lg bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Why Media Literacy Matters
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-slate-600 dark:text-slate-300 mb-4">
              In today's information landscape, developing critical thinking skills is essential. This tool helps you
              systematically evaluate news articles by:
            </p>
            <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-300">
              <li className="flex items-center gap-2 p-2 rounded-lg backdrop-blur-sm bg-white/30 dark:bg-slate-700/30 hover:bg-white/40 dark:hover:bg-slate-600/40 transition-all duration-300">
                <div className="w-1.5 h-1.5 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full animate-pulse" />
                Identifying key claims that can be fact-checked
              </li>
              <li className="flex items-center gap-2 p-2 rounded-lg backdrop-blur-sm bg-white/30 dark:bg-slate-700/30 hover:bg-white/40 dark:hover:bg-slate-600/40 transition-all duration-300">
                <div className="w-1.5 h-1.5 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full animate-pulse" />
                Analyzing language for emotional manipulation or bias
              </li>
              <li className="flex items-center gap-2 p-2 rounded-lg backdrop-blur-sm bg-white/30 dark:bg-slate-700/30 hover:bg-white/40 dark:hover:bg-slate-600/40 transition-all duration-300">
                <div className="w-1.5 h-1.5 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full animate-pulse" />
                Highlighting potential credibility concerns
              </li>
              <li className="flex items-center gap-2 p-2 rounded-lg backdrop-blur-sm bg-white/30 dark:bg-slate-700/30 hover:bg-white/40 dark:hover:bg-slate-600/40 transition-all duration-300">
                <div className="w-1.5 h-1.5 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full animate-pulse" />
                Providing actionable steps for independent verification
              </li>
            </ul>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}

import { type NextRequest, NextResponse } from "next/server"

interface ArticleData {
  title: string
  content: string
  author?: string
  url: string
  preview: string
}

export async function POST(request: NextRequest) {
  try {
    const { url } = await request.json()

    if (!url || typeof url !== "string") {
      return NextResponse.json({ error: "Valid URL is required" }, { status: 400 })
    }

    // Validate URL format
    try {
      new URL(url)
    } catch {
      return NextResponse.json({ error: "Invalid URL format" }, { status: 400 })
    }

    // Fetch the article
    const response = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
        Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.5",
        "Accept-Encoding": "gzip, deflate",
        Connection: "keep-alive",
      },
      timeout: 10000,
    })

    if (!response.ok) {
      return NextResponse.json(
        { error: `Failed to fetch article: ${response.status} ${response.statusText}` },
        { status: response.status },
      )
    }

    const html = await response.text()
    const articleData = parseArticleContent(html, url)

    if (!articleData.title && !articleData.content) {
      return NextResponse.json({ error: "Could not extract article content from this URL" }, { status: 422 })
    }

    return NextResponse.json(articleData)
  } catch (error) {
    console.error("Error fetching article:", error)
    return NextResponse.json({ error: "Failed to fetch article. Please check the URL and try again." }, { status: 500 })
  }
}

function parseArticleContent(html: string, url: string): ArticleData {
  // Remove script and style tags
  const cleanHtml = html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
    .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, "")

  // Extract title - try multiple selectors
  const titleSelectors = [
    /<title[^>]*>([^<]+)<\/title>/i,
    /<h1[^>]*class="[^"]*title[^"]*"[^>]*>([^<]+)<\/h1>/i,
    /<h1[^>]*class="[^"]*headline[^"]*"[^>]*>([^<]+)<\/h1>/i,
    /<h1[^>]*>([^<]+)<\/h1>/i,
    /<meta\s+property="og:title"\s+content="([^"]+)"/i,
    /<meta\s+name="title"\s+content="([^"]+)"/i,
  ]

  let title = ""
  for (const selector of titleSelectors) {
    const match = cleanHtml.match(selector)
    if (match && match[1]) {
      title = match[1].trim()
      break
    }
  }

  // Extract author
  const authorSelectors = [
    /<meta\s+name="author"\s+content="([^"]+)"/i,
    /<span[^>]*class="[^"]*author[^"]*"[^>]*>([^<]+)<\/span>/i,
    /<div[^>]*class="[^"]*author[^"]*"[^>]*>([^<]+)<\/div>/i,
    /<p[^>]*class="[^"]*byline[^"]*"[^>]*>([^<]+)<\/p>/i,
  ]

  let author = ""
  for (const selector of authorSelectors) {
    const match = cleanHtml.match(selector)
    if (match && match[1]) {
      author = match[1].replace(/^by\s+/i, "").trim()
      break
    }
  }

  // Extract main content - try multiple selectors for article content
  const contentSelectors = [
    /<article[^>]*>([\s\S]*?)<\/article>/i,
    /<div[^>]*class="[^"]*content[^"]*"[^>]*>([\s\S]*?)<\/div>/i,
    /<div[^>]*class="[^"]*article[^"]*"[^>]*>([\s\S]*?)<\/div>/i,
    /<div[^>]*class="[^"]*post[^"]*"[^>]*>([\s\S]*?)<\/div>/i,
    /<main[^>]*>([\s\S]*?)<\/main>/i,
  ]

  let contentHtml = ""
  for (const selector of contentSelectors) {
    const match = cleanHtml.match(selector)
    if (match && match[1]) {
      contentHtml = match[1]
      break
    }
  }

  // If no content found, try to extract paragraphs from the body
  if (!contentHtml) {
    const bodyMatch = cleanHtml.match(/<body[^>]*>([\s\S]*?)<\/body>/i)
    if (bodyMatch) {
      contentHtml = bodyMatch[1]
    }
  }

  // Extract text content from HTML and clean it up
  const content = contentHtml
    .replace(/<[^>]+>/g, " ") // Remove HTML tags
    .replace(/\s+/g, " ") // Normalize whitespace
    .replace(/&nbsp;/g, " ") // Replace non-breaking spaces
    .replace(/&amp;/g, "&") // Decode HTML entities
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .trim()

  // Create preview (first 200 characters)
  const preview = content.length > 200 ? content.substring(0, 200) + "..." : content

  return {
    title: title || "Untitled Article",
    content,
    author: author || undefined,
    url,
    preview,
  }
}

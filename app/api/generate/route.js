import { NextResponse } from 'next/server';

const SCRAPER_API_KEY = process.env.SCRAPER_API_KEY; // <-- make sure this is set in Vercel!

export async function POST(req) {
  const { name, materials, condition, dimensions, similarLink } = await req.json();

  let scrapedTitle = '';
  let scrapedPrice = '';

  if (similarLink) {
    try {
      const scraperRes = await fetch(`http://api.scraperapi.com?api_key=${SCRAPER_API_KEY}&url=${encodeURIComponent(similarLink)}`);
      const html = await scraperRes.text();

      // Very basic scraping
      const titleMatch = html.match(/<title>(.*?)<\/title>/i);
      if (titleMatch) {
        scrapedTitle = titleMatch[1].replace(/ - Etsy.*$/, '').trim(); // Clean up " - Etsy" from title
      }

      const priceMatch = html.match(/\$([0-9]+(?:\.[0-9]{1,2})?)/);
      if (priceMatch) {
        scrapedPrice = priceMatch[1];
      }

      // Always log after attempting scrape
      console.log('Scraped Title:', scrapedTitle);
      console.log('Scraped Price:', scrapedPrice);

    } catch (error) {
      console.error('ScraperAPI fetch failed:', error);
    }
  }

  // Now construct the AI prompt
  const prompt = `
You are a Facebook Marketplace listing assistant helping users create vintage item listings.

Item Details:
- Name: ${name}
- Materials: ${materials}
- Condition: ${condition}
- Dimensions: ${dimensions}
${scrapedTitle ? `- Reference Item Title: ${scrapedTitle}` : ''}
${scrapedPrice ? `- Reference Item Price: $${scrapedPrice}` : ''}

Instructions:
- Estimate a realistic local sale price based on the item details and any reference price.
- Output ONLY a plain number for Price (no dollar sign or extra text).
- Write a short, SEO-optimized Title (max 65 characters).
- List 5–10 comma-separated SEO Keywords.
- Write a concise 2–4 sentence Description using some keywords naturally.

Format your output exactly as:
Price: [number]
Title: [short title]
Keywords: [keyword1, keyword2, ...]
Description: [short description]

Do not include any explanations.
`;

  try {
    const openaiRes = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o', // you have access ✅
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.5,
      }),
    });

    const data = await openaiRes.json();
    console.log('OpenAI raw response:', data);

    const text = data.choices?.[0]?.message?.content || 'No response generated.';
    return NextResponse.json({ result: text });

  } catch (error) {
    console.error('OpenAI API Error:', error);
    return NextResponse.json({ result: 'Error generating listing. Please try again.' });
  }
}

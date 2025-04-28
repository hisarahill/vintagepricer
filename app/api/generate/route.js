import { NextResponse } from 'next/server';

const SCRAPER_API_KEY = process.env.SCRAPER_API_KEY;

export async function POST(req) {
  const { name, materials, condition, dimensions, similarLink } = await req.json();

  let scrapedTitle = '';
  let scrapedPrice = '';

  if (similarLink && process.env.VERCEL_ENV !== 'development') { // 👈 prevent scraping during build
    try {
      const scraperRes = await fetch(`http://api.scraperapi.com?api_key=${SCRAPER_API_KEY}&url=${encodeURIComponent(similarLink)}`);
      const html = await scraperRes.text();

      const titleMatch = html.match(/<title>(.*?)<\/title>/i);
      if (titleMatch) {
        scrapedTitle = titleMatch[1].replace(/ - Etsy.*$/, '').trim();
      }

      const priceMatch = html.match(/\$([0-9]+(?:\.[0-9]{1,2})?)/);
      if (priceMatch) {
        scrapedPrice = priceMatch[1];
      }

      console.log('Scraped Title:', scrapedTitle);
      console.log('Scraped Price:', scrapedPrice);

    } catch (error) {
      console.error('ScraperAPI fetch failed:', error);
    }
  }

  const prompt = `
You are a Facebook Marketplace listing assistant.

Item:
- Name: ${name}
- Materials: ${materials}
- Condition: ${condition}
- Dimensions: ${dimensions}
${scrapedTitle ? `- Reference Title: ${scrapedTitle}` : ''}
${scrapedPrice ? `- Reference Price: $${scrapedPrice}` : ''}

Please output:
Price: [plain number]
Title: [short title]
Keywords: [comma-separated]
Description: [short description]
`;

  try {
    const openaiRes = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o',
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

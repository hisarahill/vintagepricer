import { NextResponse } from 'next/server';

const SCRAPER_API_KEY = process.env.SCRAPER_API_KEY;
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

export async function POST(req) {
  const { name, materials, condition, dimensions, similarLink } = await req.json();

  let scrapedTitle = '';
  let scrapedPrice = '';

  if (similarLink) {
    try {
      const scraperRes = await fetch(`https://app.scrapingbee.com/api/v1/?api_key=${SCRAPER_API_KEY}&url=${encodeURIComponent(similarLink)}&render_js=true`);
      const html = await scraperRes.text();

      const titleMatch = html.match(/<meta property="og:title" content="(.*?)"/i) || html.match(/<title>(.*?)<\/title>/i);
      if (titleMatch) {
        scrapedTitle = titleMatch[1].replace(/ - Etsy.*$/, '').trim();
      }

      const priceMatch = html.match(/\$([0-9]+(?:\.[0-9]{1,2})?)/);
      if (priceMatch) {
        scrapedPrice = priceMatch[1];
      }

      console.log('✅ Scraped Title:', scrapedTitle);
      console.log('✅ Scraped Price:', scrapedPrice);
    } catch (err) {
      console.error('❌ Scraping error:', err);
    }
  }

  const prompt = `
You are helping create a vintage item listing.

Item details:
- Name: ${name}
- Materials: ${materials}
- Condition: ${condition}
- Dimensions: ${dimensions}
${scrapedTitle ? `- Reference Item Title: ${scrapedTitle}` : ''}
${scrapedPrice ? `- Reference Item Price: $${scrapedPrice}` : ''}

Instructions:
- Estimate a fair Facebook Marketplace price (USD), considering any reference price.
- Write a short Title (max 65 characters).
- List 5–10 SEO keywords (comma-separated).
- Write a 2–4 sentence Description naturally using keywords.

Output format:
Price: [number]
Title: [text]
Keywords: [comma-separated keywords]
Description: [text]
`;

  try {
    const openaiRes = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.5,
      }),
    });

    const data = await openaiRes.json();
    const result = data?.choices?.[0]?.message?.content;

    console.log('📦 OpenAI final result:', result); // Key log!

    return NextResponse.json({ result: result || '' });
  } catch (err) {
    console.error('❌ OpenAI error:', err);
    return NextResponse.json({ result: 'Error generating listing.' });
  }
}

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
You are helping create a Facebook Marketplace listing for a vintage item.

Here are the item details:
- Name: ${name}
- Materials: ${materials}
- Condition: ${condition}
- Dimensions: ${dimensions}
${scrapedTitle ? `- Reference Item Title from Etsy: ${scrapedTitle}` : ''}
${scrapedPrice ? `- Reference Item Price on Etsy: $${scrapedPrice}` : ''}

Instructions:
1. Estimate a fair local sale price (USD) for Facebook Marketplace. 
   - Consider the item's condition and the typical price difference between local resale and online marketplaces like Etsy (local is often 20–40% lower).
   - Reference the Etsy price if available, but adjust accordingly for condition and local demand.
   - Output only the number (e.g., "35"). No dollar signs or extra words.

2. Write a short Title (max 65 characters) suitable for a Facebook listing.

3. List 5–10 SEO keywords (comma-separated) that describe this item and how buyers might search for it.

4. Write a short, friendly Description (2–4 sentences max) using a few keywords naturally. 
   - Avoid flowery language and sales hype.
   - Focus on what it is, its appeal, and who might like it.

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

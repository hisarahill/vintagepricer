import { NextResponse } from 'next/server';

const SCRAPER_API_KEY = process.env.SCRAPER_API_KEY; // <-- add this to Vercel too!

export async function POST(req) {
  const { name, materials, condition, dimensions, similarLink } = await req.json();

  let scrapedTitle = '';
  let scrapedPrice = '';

  if (similarLink) {
    try {
      const scraperRes = await fetch(`http://api.scraperapi.com?api_key=${SCRAPER_API_KEY}&url=${encodeURIComponent(similarLink)}`);
      const html = await scraperRes.text();

      // VERY basic parsing — just quick and dirty
      const titleMatch = html.match(/<title>(.*?)<\/title>/i);
      if (titleMatch) {
        scrapedTitle = titleMatch[1].replace(/ - Etsy.*$/, '').trim(); // Clean up " - Etsy" from title
      }

      const priceMatch = html.match(/\$([0-9]+(?:\.[0-9]{1,2})?)/);
      if (priceMatch) {
        scrapedPrice = priceMatch[1];
      }
    } catch (error) {
      console.error('ScraperAPI failed:', error);
    }
  }

  // Now build the AI prompt
  const prompt = `
You are an assistant helping a user create a vintage item listing for Facebook Marketplace.

Item details:
- Name: ${name}
- Materials: ${materials}
- Condition: ${condition}
- Dimensions: ${dimensions}
${scrapedTitle ? `- Reference Item Title: ${scrapedTitle}` : ''}
${scrapedPrice ? `- Reference Item Price: $${scrapedPrice}` : ''}

Instructions:
- Estimate a fair local sale price based on the item and any reference price. Output ONLY the number, no dollar signs or text.
- Write a short, SEO-friendly Title (maximum 65 characters).
- List 5–10 SEO keywords (comma-separated).
- Write a concise Description (2-4 sentences) naturally using some keywords.

Format your reply exactly like:
Price: [number]
Title: [short title]
Keywords: [comma-separated keywords]
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
    console.log('OpenAI response:', data);

    const text = data.choices?.[0]?.message?.content || 'No response generated.';
    return NextResponse.json({ result: text });

  } catch (error) {
    console.error('OpenAI API Error:', error);
    return NextResponse.json({ result: 'Error generating listing. Please try again.' });
  }
}

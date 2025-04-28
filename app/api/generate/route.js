import { NextResponse } from 'next/server';

const SCRAPINGBEE_API_KEY = process.env.SCRAPINGBEE_API_KEY;

export async function POST(req) {
  const { name, materials, condition, dimensions, similarLink } = await req.json();

  let scrapedHTML = '';

  if (similarLink) {
    try {
      const scraperRes = await fetch(`https://app.scrapingbee.com/api/v1/?api_key=${SCRAPINGBEE_API_KEY}&url=${encodeURIComponent(similarLink)}&render_js=false`);
      scrapedHTML = await scraperRes.text();
    } catch (error) {
      console.error('ScrapingBee failed:', error);
    }
  }

  const prompt = `
You are a helpful assistant.

Here is the raw HTML of a vintage item listing page:

${scrapedHTML ? scrapedHTML.substring(0, 12000) : '[No HTML provided]'}

Tasks:
- If HTML is provided, extract:
  - Title (clean short name)
  - Price (only the number)

Output exactly like:

Title: [title]
Price: [number]

---

Now here is extra item info:
- Name: ${name}
- Materials: ${materials}
- Condition: ${condition}
- Dimensions: ${dimensions}

Generate:
- Fair local sale Price
- Short Title (max 65 characters)
- 5–10 SEO Keywords
- 2–4 sentence friendly Description
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

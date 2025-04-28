import { NextResponse } from 'next/server';

export async function POST(req) {
  const { name, materials, condition, dimensions, similarLink } = await req.json();

  let scrapedHTML = '';

  if (similarLink) {
    try {
      const scraperRes = await fetch(similarLink, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/113 Safari/537.36',
        }
      });

      scrapedHTML = await scraperRes.text();
    } catch (error) {
      console.error('Failed to fetch page:', error);
    }
  }

  const prompt = `
You are a helpful assistant.

Here is the raw HTML of a vintage item listing page:

${scrapedHTML ? scrapedHTML.substring(0, 12000) : '[No HTML provided]'}

Tasks:
- If HTML is provided, extract:
  - Title (short and clean, no brand name junk)
  - Price (only the number, no dollar sign, no extra text)

- If NO HTML is provided, just skip.

Output exactly like:

Title: [title here]
Price: [price number only]

---

Now, item manual details:
- Name: ${name}
- Materials: ${materials}
- Condition: ${condition}
- Dimensions: ${dimensions}

Using all available info, generate:

1. A fair local sale price (in USD).
2. A short SEO-friendly Title (max 65 characters).
3. 5–10 SEO Keywords (comma-separated).
4. A friendly 2–4 sentence Description naturally using the keywords.

Respond exactly like:

Price: [number]
Title: [title]
Keywords: [comma, separated, keywords]
Description: [friendly short paragraph]
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

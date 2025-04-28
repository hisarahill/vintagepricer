import { NextResponse } from 'next/server';

export async function POST(req) {
  const { name, materials, condition, dimensions, similarLink } = await req.json();

  const prompt = `
You are a Facebook marketplace vintage reseller.

Given these item details:

- Name: ${name}
- Materials: ${materials}
- Condition: ${condition}
- Dimensions: ${dimensions}

${similarLink ? `They also provided a similar listing link for reference: ${similarLink}` : ''}

Perform these tasks:

1. Estimate a fair local sale price in USD. Output only the number (e.g., "35"). No dollar signs, no extra text.
2. Write a short, simple Title for the listing (maximum 65 characters).
3. Generate 5–10 high-SEO and long-tail Keywords about this item (comma-separated).
4. Write a short Description (2–4 sentences) that is plain, factual, and friendly. 
   - Avoid overly salesy or emotional language.
   - Naturally incorporate some of the high-SEO keywords into the description.

Output exactly these fields labeled: "Price", "Title", "Keywords", "Description".
Do not include any explanations or extra commentary.
`;

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
  const text = data.choices?.[0]?.message?.content || 'No response generated.';

  return NextResponse.json({ result: text });
}

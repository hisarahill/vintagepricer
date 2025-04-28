import { NextResponse } from 'next/server';

export async function POST(req) {
  const { name, category, materials, condition, dimensions } = await req.json();

const prompt = `
You are helping someone write a Facebook Marketplace listing for a vintage item.

Given these details:

- Name: ${name}
- Materials: ${materials}
- Condition: ${condition}
- Dimensions: ${dimensions}

Perform these tasks:

1. Estimate a fair local sale price in USD. Output only the number (e.g., "35"). No dollar signs, no extra text.
2. Write a short, simple Title for the listing (maximum 65 characters).
3. Generate 5–10 high-SEO and long-tail Keywords about this item (comma-separated).
4. Write a short Description (2–3 sentences) that is plain, factual, and friendly. 
   - Avoid overly salesy or emotional language.
   - Naturally incorporate some of the high-SEO keywords you generated into the sentences.

Output exactly four fields labeled: "Price", "Title", "Keywords", "Description".
Do not include any explanations, extra commentary, or headings beyond those four fields.
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

    if (!openaiRes.ok) {
      console.error('OpenAI API error:', data);
      return NextResponse.json({ result: 'OpenAI API error occurred.' });
    }

    const text = data.choices?.[0]?.message?.content || 'No response generated.';

    return NextResponse.json({ result: text });

  } catch (error) {
    console.error('Server error:', error);
    return NextResponse.json({ result: 'Server error occurred.' });
  }
}

import { NextResponse } from 'next/server';

export async function POST(req) {
  const { name, category, materials, condition, dimensions } = await req.json();

const prompt = `
You are a Facebook Marketplace resale expert.

Given the following vintage item details:

- Name: ${name}
- Materials: ${materials}
- Condition: ${condition}
- Dimensions: ${dimensions}

Perform these tasks:

1. Estimate a fair local sale price in USD. Output only the number (e.g., "35"). No dollar signs, no extra text.
2. Write a short, catchy Title suitable for Facebook Marketplace (maximum 65 characters).
3. Generate a short list (5–10 terms) of high-SEO and long-tail keywords relevant to the item.
4. Write a concise, compelling Description (2–4 sentences) naturally incorporating the keywords, focusing on value and appeal.

Output ONLY the four fields clearly labeled: "Price", "Title", "Keywords", "Description".
Do not include any extra commentary, headings, or explanations.
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

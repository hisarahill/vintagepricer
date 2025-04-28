import { NextResponse } from 'next/server';

export async function POST(req) {
  const { name, category, materials, condition, dimensions } = await req.json();

const prompt = `
You are a vintage resale pricing and marketing expert.

Given the following item details, perform these tasks:

1. Estimate a fair local sale price in USD based on the item's type, material, condition, and dimensions.
2. Write a complete Facebook Marketplace listing including:
   - A descriptive Title
   - A detailed SEO-optimized Description
   - A list of relevant Search Keywords (formatted as a comma-separated list)

Here are the item details:
- Name: ${name}
- Materials: ${materials}
- Condition: ${condition}
- Dimensions: ${dimensions}

Use reasonable assumptions if needed, and fill in any missing details naturally.
Generate a fully completed listing without asking for additional information.
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

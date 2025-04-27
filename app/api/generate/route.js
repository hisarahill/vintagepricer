import { NextResponse } from 'next/server';

export async function POST(req) {
  const { name, category, materials, condition, dimensions } = await req.json();

  const prompt = `
You are a vintage resale pricing expert. Based on the following item details, estimate a fair Facebook Marketplace listing price for local sale in USD. Then write a short Facebook Marketplace listing including a catchy title, SEO-optimized description, and useful search keywords.

Item Details:
- Name: ${name}
- Category: ${category}
- Materials: ${materials}
- Condition: ${condition}
- Dimensions: ${dimensions}
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

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

  const openaiRes = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.VintagePricer}`,
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

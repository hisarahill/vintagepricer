import { NextResponse } from 'next/server';

export async function POST(req) {
  const { name, materials, condition, dimensions, similarLink } = await req.json();

const prompt = `
You are a Facebook Marketplace listing assistant. Your job is to help vintage resellers create listings.

Given these item details:

- Name: ${name}
- Materials: ${materials}
- Condition: ${condition}
- Dimensions: ${dimensions}
${similarLink ? `- Similar Listing: ${similarLink}` : ''}

Instructions:
- First, estimate a fair local sale price (numeric only, no symbols).
- Second, create a short title for the item (max 65 characters).
- Third, create 5-10 SEO-friendly keywords, comma-separated.
- Fourth, write a short 2-4 sentence description, using some keywords naturally.

**Important Formatting: Output EXACTLY like this, no extra text:**

Price: [only the number]
Title: [short title]
Keywords: [keyword1, keyword2, keyword3, ...]
Description: [short description]

Do not add anything extra. Just fill the 4 fields.
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
    return NextResponse.json({ result: 'Error generating listing. Please try again later.' });
  }
}

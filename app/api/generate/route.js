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
${similarLink ? `- Similar Listing Link: ${similarLink}` : ''}

Tasks:
1. Estimate a fair local sale price in USD. Only output a plain number (e.g., "35") with no dollar signs.
2. Write a short, SEO-optimized Title (max 65 characters).
3. Generate 5–10 high-SEO and long-tail Keywords about this item (comma-separated).
4. Write a short Description (2–4 sentences) that is plain, factual, and friendly. 
   - Avoid overly salesy or emotional language.
   - Naturally incorporate some of the high-SEO keywords into the description.


Return output with labels exactly: "Price", "Title", "Keywords", "Description". No extra commentary.
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

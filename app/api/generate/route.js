import { NextResponse } from 'next/server';

export async function POST(req) {
  const { name, materials, condition, dimensions, similarLink } = await req.json();

const prompt = `
You are an expert Facebook Marketplace vintage item seller. 
Given these item details:

- Name: ${name}
- Materials: ${materials}
- Condition: ${condition}
- Dimensions: ${dimensions}
${similarLink ? `- Reference Listing Link: ${similarLink}` : ''}

Follow these strict instructions:
1. Estimate a realistic local sale Price in USD. Output only the number. No dollar signs, no explanation.
2. Write a short, catchy Title for Facebook Marketplace (maximum 65 characters).
3. List 5-10 high-SEO Keywords (comma-separated, no bullet points).
4. Write a short Description (2-4 sentences). The description MUST naturally incorporate some of the keywords. Avoid sounding overly salesy.

Important:
- Output the result exactly in this structure:

Price: [price]
Title: [title]
Keywords: [keyword1, keyword2, keyword3...]
Description: [description]

Do not explain anything. Only fill out the sections above.
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

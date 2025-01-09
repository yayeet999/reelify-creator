import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const templates = [
  "Not me ____",
  "POV you tried ____ and now you cant go back",
  "BRUH why did ....",
  "just found a '' that feels illegal",
  "hear me out ''",
  "the way i gasped when i saw",
  "'' def understood the assignment",
  "this is your sign to",
  "living rent free in my head",
  "the *audacity* of",
  "wait for it...",
  "I was today year's old when i found out ___",
  "Tell me you're '' without tell me",
  "it's giving __",
  "this hack will save you hours",
  "you wont BELIEVE what i ___",
  "Red flags",
  "this is about to change EVERYTHING",
  "Im about to expose",
  "Unpopular opinion, but",
  "I can't be the only one who",
  "what they don't tell you about",
  "the way i gasped when i realized",
  "I wasn't going to share this BUT",
  "How to go from ___ to ___",
  "Say goodbye to __",
  "It's never been this easy to __",
  "Did you know that __",
  "I wish I knew this sooner ___",
  "Something you didn't know...",
  "10 '' I wish I knew earlier",
  "Nobody is talking about __",
  "you need to STOP doing ___",
  "STOP doing ___, instead do ___",
  "9 scientific reasons they ___",
  "I am constantly amazed at ___",
  "I don't think people understand how much ___"
];

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { productName, productDescription } = await req.json();
    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

    if (!openAIApiKey) {
      throw new Error('OpenAI API key not found');
    }

    const prompt = `
You are tasked with generating 20 TikTok/Reels short-form video hooks tailored for a Gen Z audience, using the following templates:

${templates.join("\n")}

Take the following product details:
- Product Name: ${productName}
- Product Description: ${productDescription}

Rules:
1. Use the templates to fill in blanks or adjust phrasing for relevance.
2. Keep each hook between 5-15 words.
3. Make the hooks engaging, trendy, and relatable to Gen Z.
4. Return the output as a JSON array of 20 hooks.

Example Output:
[
  "Not me buying this new gadget",
  "POV you tried this product and now you cant go back",
  "BRUH why did no one tell me about this"
]
`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { 
            role: 'system', 
            content: 'You are a creative assistant for generating TikTok hooks.' 
          },
          { 
            role: 'user', 
            content: prompt 
          }
        ],
        max_tokens: 1000,
      }),
    });

    const data = await response.json();
    const hooks = JSON.parse(data.choices[0].message.content);

    return new Response(JSON.stringify({ hooks }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in generate-hooks function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
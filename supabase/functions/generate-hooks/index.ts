import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

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
  "Unpopular opinion, but"
];

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    if (!openAIApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    const { productName, productDescription } = await req.json();

    if (!productName || !productDescription) {
      return new Response(
        JSON.stringify({ error: 'Product name and description are required' }), 
        { 
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    console.log('Making request to OpenAI...');
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
            content: 'You are tasked with generating engaging TikTok/Reels hooks for a Gen Z audience. Return only a JSON array of 20 hooks.' 
          },
          { 
            role: 'user', 
            content: `Generate 20 TikTok/Reels hooks for this product:
              Product Name: ${productName}
              Product Description: ${productDescription}
              
              Use these templates as inspiration but feel free to modify them:
              ${templates.join("\n")}
              
              Rules:
              1. Keep each hook between 5-15 words
              2. Make them engaging and trendy for Gen Z
              3. Return ONLY a JSON array of strings, nothing else
              4. Each hook should be complete and ready to use`
          }
        ],
        temperature: 0.7,
        max_tokens: 1000,
      }),
    });

    console.log('Received response from OpenAI');
    const data = await response.json();
    
    if (!response.ok) {
      console.error('OpenAI API error:', data);
      throw new Error(data.error?.message || 'Error calling OpenAI API');
    }

    if (!data.choices?.[0]?.message?.content) {
      throw new Error('Invalid response from OpenAI');
    }

    // Parse the response content as JSON array
    let hooks;
    try {
      hooks = JSON.parse(data.choices[0].message.content);
      if (!Array.isArray(hooks)) {
        hooks = data.choices[0].message.content.split('\n').filter(Boolean);
      }
    } catch (e) {
      // If parsing fails, split by newlines as fallback
      hooks = data.choices[0].message.content.split('\n').filter(Boolean);
    }

    console.log('Successfully generated hooks:', hooks);

    return new Response(
      JSON.stringify({ hooks }), 
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );

  } catch (error) {
    console.error('Error in generate-hooks function:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Failed to generate hooks. Please try again.' 
      }), 
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
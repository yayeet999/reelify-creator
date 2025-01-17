import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import "https://deno.land/x/xhr@0.1.0/mod.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { voiceId, text } = await req.json()
    const apiKey = Deno.env.get('ELEVENLABS_API_KEY')

    if (!apiKey) {
      throw new Error('ELEVENLABS_API_KEY is not set')
    }

    console.log('Generating voice with:', { voiceId, textLength: text.length })

    const response = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`,
      {
        method: 'POST',
        headers: {
          'Accept': 'audio/mpeg',
          'Content-Type': 'application/json',
          'xi-api-key': apiKey,
        },
        body: JSON.stringify({
          text,
          model_id: "eleven_multilingual_v2",
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.75,
          }
        }),
      }
    )

    if (!response.ok) {
      const error = await response.text()
      console.error('ElevenLabs API error:', error)
      throw new Error(`ElevenLabs API error: ${error}`)
    }

    // Get the audio data
    const audioBuffer = await response.arrayBuffer()

    // Upload to Cloudinary with the new preset for audio
    const formData = new FormData()
    formData.append('file', new Blob([audioBuffer], { type: 'audio/mpeg' }))
    formData.append('upload_preset', 'temp_audio_upload')
    
    const cloudinaryResponse = await fetch(
      'https://api.cloudinary.com/v1_1/fornotreel/upload',
      {
        method: 'POST',
        body: formData,
      }
    )

    if (!cloudinaryResponse.ok) {
      throw new Error('Failed to upload audio to Cloudinary')
    }

    const cloudinaryData = await cloudinaryResponse.json()
    console.log('Audio uploaded to Cloudinary:', cloudinaryData.secure_url)

    return new Response(
      JSON.stringify({ audioUrl: cloudinaryData.secure_url }),
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    )
  } catch (error) {
    console.error('Error in generate-voice function:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    )
  }
})
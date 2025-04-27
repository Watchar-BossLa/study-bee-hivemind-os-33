
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.7'
import { corsHeaders } from '../_shared/cors.ts'

const supabaseUrl = 'https://zhvhqpdcxgmcdoowahql.supabase.co'
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || ''

// Simulate OCR processing (in a real implementation, this would use a proper OCR service)
async function processImage(imageUrl: string): Promise<Array<{ question: string; answer: string }>> {
  // Simulated delay to mimic processing time
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // Mock OCR results - in production this would use a real OCR service
  return [
    { question: "What is the capital of France?", answer: "Paris" },
    { question: "What year did World War II end?", answer: "1945" }
  ];
}

Deno.serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabase = createClient(supabaseUrl, supabaseServiceKey)
    
    // Get request JSON
    const { uploadId } = await req.json()
    
    // Get upload record
    const { data: upload, error: uploadError } = await supabase
      .from('ocr_uploads')
      .select('*')
      .eq('id', uploadId)
      .single()
      
    if (uploadError || !upload) {
      throw new Error('Upload not found')
    }
    
    // Update status to processing
    await supabase
      .from('ocr_uploads')
      .update({ status: 'processing' })
      .eq('id', uploadId)
    
    try {
      // Process the image
      const flashcards = await processImage(upload.image_url)
      
      // Insert flashcards
      await supabase.from('flashcards').insert(
        flashcards.map(card => ({
          upload_id: uploadId,
          user_id: upload.user_id,
          question: card.question,
          answer: card.answer
        }))
      )
      
      // Update upload status to completed
      await supabase
        .from('ocr_uploads')
        .update({ status: 'completed' })
        .eq('id', uploadId)
        
      return new Response(
        JSON.stringify({ success: true }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    } catch (error) {
      // Update upload status to error
      await supabase
        .from('ocr_uploads')
        .update({ 
          status: 'error',
          error_message: error.message 
        })
        .eq('id', uploadId)
        
      throw error
    }
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})

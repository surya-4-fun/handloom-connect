import { serve } from "https://deno.land/std@0.177.0/http/server.ts"
import { corsHeaders } from "../_shared/cors.ts"

console.log("Hello from ai-product-preview!")

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { productId, height, weight, bodyShape, productImage } = await req.json()

    // Here you would integrate with an AI image generation model
    // For now, return a mock response that echoes back the original image
    
    return new Response(
      JSON.stringify({
        status: 'success',
        previewUrl: productImage || '', // In a real app this would be the generated image
        disclaimer: 'This is a mock AI generated preview.',
        isMock: true,
        product: {
          id: productId,
          name: 'Preview Product',
          category: 'Clothing',
          image: productImage,
          craft: 'Handloom'
        },
        attributes: { height, weight, bodyShape },
        createdAt: new Date().toISOString()
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    )
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 400,
    })
  }
})

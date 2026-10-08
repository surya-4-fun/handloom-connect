import { serve } from "https://deno.land/std@0.177.0/http/server.ts"
import { corsHeaders } from "../_shared/cors.ts"

console.log("ai-chat Edge Function initialized")

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { message, context, history } = await req.json()

    const openAiApiKey = Deno.env.get('OPENAI_API_KEY')
    const geminiApiKey = Deno.env.get('GEMINI_API_KEY')

    const systemPrompt = `You are the Handloom Connect AI Curator and Textile Stylist. You specialize in authentic Indian handloom textiles (such as Kanchipuram silk, Banarasi brocades, Kashmiri Pashmina, Jamdani, Patola, Chanderi), raw materials (Mulberry silk filaments, organic Khadi cotton, natural indigo, madder dye), artisan provenance, GI tags, and heirloom pairing. Provide evocative, polite, knowledgeable, and culturally resonant recommendations. Keep answers concise, elegant, and helpful.`

    if (openAiApiKey) {
      try {
        const messages = [
          { role: 'system', content: systemPrompt },
          ...(Array.isArray(history)
            ? history.slice(-6).map((h: { sender: string; text: string }) => ({
                role: h.sender === 'user' ? 'user' : 'assistant',
                content: h.text,
              }))
            : []),
          {
            role: 'user',
            content: context?.currentPage
              ? `[Current view: ${context.currentPage}${context.productId ? `, product: ${context.productId}` : ''}${context.rawMaterialId ? `, material: ${context.rawMaterialId}` : ''}] ${message}`
              : message,
          },
        ]

        const aiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${openAiApiKey}`,
          },
          body: JSON.stringify({
            model: 'gpt-4o-mini',
            messages,
            temperature: 0.7,
            max_tokens: 500,
          }),
        })

        if (aiResponse.ok) {
          const data = await aiResponse.json()
          const replyText = data.choices?.[0]?.message?.content?.trim()
          if (replyText) {
            return new Response(
              JSON.stringify({
                reply: replyText,
                suggestions: [
                  { title: 'Banarasi Real Zari Katan Silk', craft: 'Banarasi Brocade', price: '₹48,500' },
                  { title: 'Kanchipuram Temple Border Korvai Silk', craft: 'Korvai Weave', price: '₹39,200' },
                ],
              }),
              { headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
            )
          }
        }
      } catch (providerErr) {
        console.warn('OpenAI request failed, continuing to fallback:', providerErr)
      }
    } else if (geminiApiKey) {
      try {
        const messages = [
          { role: 'system', content: systemPrompt },
          ...(Array.isArray(history)
            ? history.slice(-6).map((h: { sender: string; text: string }) => ({
                role: h.sender === 'user' ? 'user' : 'assistant',
                content: h.text,
              }))
            : []),
          {
            role: 'user',
            content: context?.currentPage
              ? `[Current view: ${context.currentPage}${context.productId ? `, product: ${context.productId}` : ''}${context.rawMaterialId ? `, material: ${context.rawMaterialId}` : ''}] ${message}`
              : message,
          },
        ]

        const aiResponse = await fetch('https://generativelanguage.googleapis.com/v1beta/openai/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${geminiApiKey}`,
          },
          body: JSON.stringify({
            model: 'gemini-1.5-flash',
            messages,
            temperature: 0.7,
            max_tokens: 500,
          }),
        })

        if (aiResponse.ok) {
          const data = await aiResponse.json()
          const replyText = data.choices?.[0]?.message?.content?.trim()
          if (replyText) {
            return new Response(
              JSON.stringify({
                reply: replyText,
                suggestions: [
                  { title: 'Banarasi Real Zari Katan Silk', craft: 'Banarasi Brocade', price: '₹48,500' },
                  { title: 'Kanchipuram Temple Border Korvai Silk', craft: 'Korvai Weave', price: '₹39,200' },
                ],
              }),
              { headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
            )
          }
        }
      } catch (providerErr) {
        console.warn('Gemini request failed, continuing to fallback:', providerErr)
      }
    }

    // Curated domain-aware fallback response when AI provider secret is not yet configured
    const promptLower = (message || '').toLowerCase()
    let replyText = `Thank you for consulting Handloom Connect. Regarding "${message}": Our artisan guild specializes in GI-certified handloomed heirlooms and natural raw materials.`
    let suggestions = [
      { title: 'Banarasi Real Zari Katan Silk Saree', craft: 'Banarasi Brocade', price: '₹48,500' },
      { title: 'Kashmiri Hand-Embroidered Pashmina', craft: 'Sozni Needlework', price: '₹62,000' },
    ]
    let materialSuggestions: Array<{ name: string; category: string; price: string; unit: string; origin: string }> | undefined = undefined

    if (promptLower.includes('wedding') || promptLower.includes('bridal') || promptLower.includes('saree')) {
      replyText = 'For bridal celebrations, we recommend heirloom pure Kanchipuram Korvai silk with interlocking temple borders or Varanasi real electroplated gold zari katan silk.'
      suggestions = [
        { title: 'Kanchipuram Temple Border Korvai Silk', craft: 'Korvai Weave', price: '₹39,200' },
        { title: 'Banarasi Real Zari Katan Silk Saree', craft: 'Banarasi Brocade', price: '₹48,500' },
      ]
    } else if (promptLower.includes('yarn') || promptLower.includes('material') || promptLower.includes('silk') || promptLower.includes('cotton') || promptLower.includes('indigo') || promptLower.includes('dye')) {
      replyText = 'Our B2B artisan supply guild provides unadulterated Grade AAA Mulberry silk filaments, rain-fed organic khadi cotton hanks, and bio-fermented Kutch indigo cakes directly from verified reelers.'
      materialSuggestions = [
        { name: 'Grade AAA Mulberry Silk Filament Yarn', category: 'Silk Yarn', price: '₹5,400', unit: 'kg', origin: 'Kanchipuram' },
        { name: 'Pure Organic Indigofera Tinctoria Cakes', category: 'Indigo', price: '₹3,200', unit: 'kg', origin: 'Bhuj' },
      ]
    } else if (promptLower.includes('winter') || promptLower.includes('shawl') || promptLower.includes('pashmina')) {
      replyText = 'For winter comfort and insulation, hand-spun Ladakhi Pashmina with fine Sozni needlework offers featherweight warmth and centuries-old Kashmiri heritage.'
      suggestions = [
        { title: 'Kashmiri Hand-Embroidered Pashmina Shawl', craft: 'Sozni Needlework', price: '₹62,000' },
      ]
    }

    return new Response(
      JSON.stringify({
        reply: replyText,
        suggestions,
        materialSuggestions,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    )
  } catch (error: unknown) {
    const errorMsg = error instanceof Error ? error.message : 'Unknown error'
    return new Response(JSON.stringify({ error: errorMsg }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    })
  }
})

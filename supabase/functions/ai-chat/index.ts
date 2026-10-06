import { serve } from "https://deno.land/std@0.177.0/http/server.ts"
import { corsHeaders } from "../_shared/cors.ts"

console.log("Hello from ai-chat!")

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { message, context, history } = await req.json()

    // Here you would integrate with an AI Provider like OpenAI or OpenRouter.
    // E.g.
    // const apiKey = Deno.env.get('OPENAI_API_KEY')
    // const res = await fetch('https://api.openai.com/v1/chat/completions', { ... })
    // For now, since we need a safe mock/demo fallback, we will simulate it.

    const mockReply = `(Mock AI Mode) I received your message: "${message}". ` + 
      (context?.currentPage ? `I see you are on the ${context.currentPage} page. ` : '') +
      `Since I am running in mock mode on Supabase Edge Functions, I don't have access to the actual LLM API right now. ` +
      `Once you set the OPENAI_API_KEY in the Supabase environment, you can replace this mock with a real fetch call.`

    return new Response(
      JSON.stringify({
        reply: mockReply,
        suggestions: [
          {
            title: "Mock Suggestion",
            craft: "Handwoven",
            price: "₹4,500"
          }
        ]
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

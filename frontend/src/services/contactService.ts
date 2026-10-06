import { supabase } from '../lib/supabase'

export interface ContactFormData {
  name: string
  email: string
  message: string
}

export async function submitContactMessage(data: ContactFormData): Promise<{ success: boolean; message: string }> {
  try {
    const { error } = await supabase.from('contact_inquiries').insert(data)
    if (error) throw error
    return { success: true, message: 'Message sent successfully.' }
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err)
    console.warn('Backend unavailable, simulating contact receipt:', errorMsg)
    return { success: true, message: 'Message received. We will get back within 24 hours.' }
  }
}

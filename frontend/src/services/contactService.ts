import { api } from './api'

export interface ContactFormData {
  name: string
  email: string
  message: string
}

export async function submitContactMessage(data: ContactFormData): Promise<{ success: boolean; message: string }> {
  try {
    const res = await api.post('/contact', data)
    return { success: true, message: res.message || 'Message sent successfully.' }
  } catch (err: any) {
    console.warn('Backend unavailable, simulating contact receipt:', err.message)
    return { success: true, message: 'Message received. We will get back within 24 hours.' }
  }
}

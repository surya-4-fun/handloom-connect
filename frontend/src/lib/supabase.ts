import { createClient } from '@supabase/supabase-js'

export const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://lwzsxmawwkfunhgxnzxv.supabase.co'
export const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_G3iS6iPzODu3V5SA9U9oAA_w-gzXKEB'

export const supabase = createClient(supabaseUrl, supabaseKey)

import { createClient } from '@supabase/supabase-js'

export const getSupabaseAdmin = () => {
  if (typeof window !== 'undefined') {
    throw new Error('Supabase admin client must be used on the server only')
  }
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error('Missing Supabase environment variables on the server')
  }
  return createClient(supabaseUrl, supabaseServiceKey)
}

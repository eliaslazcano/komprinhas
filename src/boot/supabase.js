import {createClient} from '@supabase/supabase-js'
import {useSessionStore} from 'stores/session'

const supabaseUrl = process.env.SUPABASE_URL
const supabaseKey = process.env.SUPABASE_KEY
const supabase = createClient(supabaseUrl, supabaseKey)

supabase.auth.onAuthStateChange((event, session) => {
  useSessionStore().user = session?.user || null
})

export const useSupabase = () => {
  return { supabase }
}

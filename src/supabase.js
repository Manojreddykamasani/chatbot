import { createClient } from '@supabase/supabase-js'
const supabaseUrl = 'https://wtelwyjgloonqhvzfstk.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind0ZWx3eWpnbG9vbnFodnpmc3RrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc2NzY1NDYsImV4cCI6MjA2MzI1MjU0Nn0.hW8YLqbzdKJ6n1s46fMsL8FPMAasoksHGoWDDx1xQ8M'
export const supabase = createClient(supabaseUrl, supabaseKey)
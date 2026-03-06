import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://xfvbycfdccvvocxvomvz.supabase.co';
const SUPABASE_ANON_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhmdmJ5Y2ZkY2N2dm9jeHZvbXZ6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI3ODM0MzUsImV4cCI6MjA4ODM1OTQzNX0.Wq9kK0-Ik565wg72NVeoP_pKQCqVbKkYDP3qxQWEuaY';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

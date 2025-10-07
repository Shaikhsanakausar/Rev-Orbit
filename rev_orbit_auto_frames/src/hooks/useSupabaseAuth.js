import { useEffect, useState } from 'react';
import { supabase } from '../utils/supabaseClient';

export function useSupabaseAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getSession = async () => {
      const { data } = await supabase.auth.getSession();
      setUser(data?.session?.user ?? null);
      // Always save token for API requests
      if (data?.session?.access_token) {
        localStorage.setItem('sb-access-token', data.session.access_token);
      } else {
        localStorage.removeItem('sb-access-token');
      }
      setLoading(false);
    };
    getSession();

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      // Always save token for API requests
      if (session?.access_token) {
        localStorage.setItem('sb-access-token', session.access_token);
      } else {
        localStorage.removeItem('sb-access-token');
      }
    });

    return () => listener?.subscription?.unsubscribe();
  }, []);

  return { user, loading };
}

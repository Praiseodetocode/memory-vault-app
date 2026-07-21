import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import Auth from './Auth';
import Dashboard from './Dashboard';

// Replace with YOUR Supabase keys (get from Supabase dashboard)
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseKey = process.env.REACT_APP_SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

export default function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user already logged in
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      setLoading(false);
    };
    
    checkUser();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user);
      }
    );

    return () => subscription?.unsubscribe();
  }, []);

  if (loading) {
    return <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', fontSize: '18px', color: '#999'}}>Loading...</div>;
  }

  return user ? <Dashboard user={user} supabase={supabase} /> : <Auth supabase={supabase} />;
}

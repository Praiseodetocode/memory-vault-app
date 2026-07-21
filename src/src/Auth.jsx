import React, { useState } from 'react';

export default function Auth({ supabase }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAuth = async () => {
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({
          email,
          password,
        });
        if (error) throw error;
        setSuccess('Account created! Check your email to confirm.');
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        setSuccess('✨ Welcome!');
      }
      setEmail('');
      setPassword('');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f3e7e9 0%, #f7f0f3 50%, #e8f4f8 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      <div style={{
        background: 'white',
        borderRadius: '28px',
        padding: '40px',
        boxShadow: '0 20px 60px rgba(0,0,0,0.1)',
        maxWidth: '400px',
        width: '100%',
        border: '1px solid rgba(200,150,200,0.2)'
      }}>
        <div style={{textAlign: 'center', marginBottom: '32px'}}>
          <div style={{
            display: 'inline-block',
            padding: '16px',
            background: 'linear-gradient(135deg, #a855f7 0%, #ec4899 100%)',
            borderRadius: '16px',
            marginBottom: '16px'
          }}>
            <span style={{fontSize: '32px'}}>☁️</span>
          </div>
          <h1 style={{
            fontSize: '36px',
            fontWeight: 'bold',
            background: 'linear-gradient(135deg, #9333ea 0%, #db2777 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            margin: '0 0 8px 0'
          }}>
            MemoryVault
          </h1>
          <p style={{color: '#999', margin: 0, fontSize: '14px'}}>Your personal cloud, beautifully simple</p>
        </div>

        <div style={{marginBottom: '20px'}}>
          <input
            type="email"
            placeholder="your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleAuth()}
            style={{
              width: '100%',
              padding: '12px',
              borderRadius: '12px',
              border: '2px solid #e0c7f0',
              marginBottom: '12px',
              boxSizing: 'border-box',
              fontSize: '14px',
              background: 'rgba(200,150,220,0.03)'
            }}
          />
          <input
            type="password"
            placeholder="password (min 6 characters)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleAuth()}
            style={{
              width: '100%',
              padding: '12px',
              borderRadius: '12px',
              border: '2px solid #e0c7f0',
              boxSizing: 'border-box',
              fontSize: '14px',
              background: 'rgba(200,150,220,0.03)'
            }}
          />
        </div>

        {error && (
          <div style={{
            padding: '12px',
            background: '#fee2e2',
            border: '1px solid #fecaca',
            borderRadius: '8px',
            color: '#dc2626',
            fontSize: '14px',
            marginBottom: '16px'
          }}>
            {error}
          </div>
        )}

        {success && (
          <div style={{
            padding: '12px',
            background: '#dcfce7',
            border: '1px solid #bbf7d0',
            borderRadius: '8px',
            color: '#22863a',
            fontSize: '14px',
            marginBottom: '16px'
          }}>
            {success}
          </div>
        )}

        <button
          onClick={handleAuth}
          disabled={loading}
          style={{
            width: '100%',
            padding: '14px',
            background: loading ? '#ccc' : 'linear-gradient(135deg, #a855f7 0%, #ec4899 100%)',
            color: 'white',
            border: 'none',
            borderRadius: '12px',
            fontWeight: '600',
            cursor: loading ? 'not-allowed' : 'pointer',
            marginBottom: '12px',
            fontSize: '16px',
            transition: 'all 0.2s'
          }}
          onMouseOver={(e) => !loading && (e.target.style.transform = 'scale(1.02)')}
          onMouseOut={(e) => !loading && (e.target.style.transform = 'scale(1)')}
        >
          {loading ? 'Loading...' : (isSignUp ? 'Create Account' : 'Sign In')}
        </button>

        <button
          onClick={() => {
            setIsSignUp(!isSignUp);
            setError('');
            setSuccess('');
          }}
          style={{
            width: '100%',
            textAlign: 'center',
            color: '#a855f7',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '500'
          }}
        >
          {isSignUp ? 'Already have an account? Sign in' : "Don't have an account? Sign up"}
        </button>

        <div style={{marginTop: '20px', paddingTop: '20px', borderTop: '1px solid #e0c7f0', textAlign: 'center', fontSize: '12px', color: '#999'}}>
          <p style={{margin: '0 0 4px 0'}}>
            <span style={{fontWeight: '600'}}>For Jenna:</span> Free forever
          </p>
          <p style={{margin: 0}}>For others: $4.99/month (coming soon)</p>
        </div>
      </div>
    </div>
  );
}

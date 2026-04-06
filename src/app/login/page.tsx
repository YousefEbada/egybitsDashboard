'use client';

import React, { useState } from 'react';
import { useData } from '@/context/DataContext';

export default function AdminLogin() {
  const { login } = useData();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });

      if (res.ok) {
        const data = await res.json();
        login(data.token, data.role);
      } else {
        const data = await res.json();
        setError(data.message || 'Login failed');
      }
    } catch (err) {
      setError('Check if backend is running (localhost:5000)');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
      overflow: 'hidden',
      fontFamily: "'DM Sans', sans-serif"
    }}>
      {/* Background Ambience */}
      <div className="orb orb-1" />
      <div className="orb orb-2" />
      <div className="orb orb-3" />
      <div className="grid-pattern" style={{ position: 'absolute', inset: 0, opacity: 0.5, pointerEvents: 'none' }} />
      <div className="noise" />

      {/* Login Card */}
      <div 
        className="glass reveal visible card-hover" 
        style={{
          width: '100%',
          maxWidth: '440px',
          padding: '48px 40px',
          borderRadius: '24px',
          position: 'relative',
          zIndex: 10,
          boxShadow: '0 30px 60px rgba(0,0,0,0.4)',
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <h2 style={{
            fontFamily: "'Syne', sans-serif",
            fontSize: '32px',
            fontWeight: '800',
            marginBottom: '8px',
          }}>
            <span className="gradient-text">EgyBits</span> Portal
          </h2>
          <p style={{
            color: 'var(--text-muted)',
            fontSize: '15px'
          }}>
            Authorized access only
          </p>
        </div>
        
        {error && (
          <div style={{
            background: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            color: '#f87171',
            padding: '12px 16px',
            borderRadius: '12px',
            marginBottom: '24px',
            fontSize: '14px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div>
            <label style={{
              display: 'block',
              fontSize: '13px',
              fontWeight: '500',
              color: 'var(--text-secondary)',
              marginBottom: '8px',
              letterSpacing: '0.02em'
            }}>Username</label>
            <input 
              type="text"
              value={username}
              onChange={e => setUsername(e.target.value)}
              required
              className="admin-input"
              placeholder="Enter your username"
              style={{
                height: '48px',
                fontSize: '15px',
                background: 'rgba(255,255,255,0.03)'
              }}
            />
          </div>
          <div>
            <label style={{
              display: 'block',
              fontSize: '13px',
              fontWeight: '500',
              color: 'var(--text-secondary)',
              marginBottom: '8px',
              letterSpacing: '0.02em'
            }}>Password</label>
            <input 
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              className="admin-input"
              placeholder="••••••••"
              style={{
                height: '48px',
                fontSize: '15px',
                background: 'rgba(255,255,255,0.03)'
              }}
            />
          </div>
          
          <button 
            type="submit"
            disabled={loading}
            className="btn-primary"
            style={{
              width: '100%',
              marginTop: '12px',
              height: '52px',
              fontSize: '16px',
              opacity: loading ? 0.7 : 1
            }}
          >
            {loading ? (
              <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <svg className="animate-spin" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 4V2M12 22V20M4 12H2M22 12H20M17.6569 6.34315L19.0711 4.92893M4.92893 19.0711L6.34315 17.6569M17.6569 17.6569L19.0711 19.0711M4.92893 4.92893L6.34315 6.34315" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Authenticating...
              </span>
            ) : 'Access Dashboard'}
          </button>
        </form>
      </div>
    </div>
  );
}

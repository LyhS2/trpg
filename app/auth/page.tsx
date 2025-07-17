"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../utils/supabaseClient';

export default function AuthPage() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    let result;
    if (isSignUp) {
      result = await supabase.auth.signUp({ email, password });
    } else {
      result = await supabase.auth.signInWithPassword({ email, password });
    }
    setLoading(false);
    if (result.error) {
      setError(result.error.message);
    } else {
      router.push('/');
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: '80px auto', padding: 24, background: '#fffbe6', borderRadius: 12, boxShadow: '0 2px 8px #0001', fontFamily: 'MedievalSharp, serif' }}>
      <h2 style={{ fontFamily: 'UnifrakturCook, serif', fontSize: 32, textAlign: 'center' }}>
        {isSignUp ? '회원가입' : '로그인'}
      </h2>
      <form onSubmit={handleAuth}>
        <div style={{ marginBottom: 16 }}>
          <label>이메일</label>
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} required style={{ width: '100%', padding: 8, borderRadius: 6, border: '1px solid #bfa76f', fontFamily: 'inherit' }} />
        </div>
        <div style={{ marginBottom: 16 }}>
          <label>비밀번호</label>
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} required style={{ width: '100%', padding: 8, borderRadius: 6, border: '1px solid #bfa76f', fontFamily: 'inherit' }} />
        </div>
        {error && <div style={{ color: 'crimson', marginBottom: 12 }}>{error}</div>}
        <button type="submit" disabled={loading} style={{ width: '100%', padding: 10, background: '#bfa76f', color: '#fff', border: 'none', borderRadius: 6, fontWeight: 'bold', fontFamily: 'inherit', fontSize: 18 }}>
          {loading ? '처리 중...' : isSignUp ? '회원가입' : '로그인'}
        </button>
      </form>
      <div style={{ marginTop: 18, textAlign: 'center' }}>
        <button onClick={() => setIsSignUp(!isSignUp)} style={{ background: 'none', border: 'none', color: '#7c5e2a', textDecoration: 'underline', cursor: 'pointer', fontFamily: 'inherit' }}>
          {isSignUp ? '이미 계정이 있으신가요? 로그인' : '계정이 없으신가요? 회원가입'}
        </button>
      </div>
    </div>
  );
} 
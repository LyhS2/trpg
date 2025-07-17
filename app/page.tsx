"use client";
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../utils/supabaseClient';

// Edge Function 호출 유틸
async function sendActionToEdge(action: string, userId: string) {
  const res = await fetch('https://your-supabase-project-id.supabase.co/functions/v1/trpg-action', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ action, userId }),
  });
  if (!res.ok) throw new Error('서버 오류');
  return res.json();
}

export default function Home() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [action, setAction] = useState('');
  const [story, setStory] = useState<string[]>(["이곳은 용과 마법, 기사와 모험이 가득한 세계입니다. 당신의 선택이 이 세계의 운명을 바꿀지도 모릅니다."]);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user ?? null);
      setLoading(false);
      if (!data.session) router.replace('/auth');
    });
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (!session) router.replace('/auth');
    });
    return () => {
      listener.subscription.unsubscribe();
    };
  }, [router]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.replace('/auth');
  };

  const handleAction = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!action.trim()) return;
    setPending(true);
    setError('');
    try {
      const res = await sendActionToEdge(action, user.id);
      setStory(prev => [...prev, `> ${action}`, res.result, res.nextQuestion]);
      setAction('');
    } catch (err: any) {
      setError('서버와 통신 중 오류가 발생했습니다.');
    }
    setPending(false);
  };

  if (loading) return <div>로딩 중...</div>;
  if (!user) return null;

  return (
    <div style={{ maxWidth: 600, margin: '60px auto', padding: 32, background: '#fffbe6', borderRadius: 16, boxShadow: '0 2px 12px #0002', fontFamily: 'MedievalSharp, serif' }}>
      <h1 style={{ fontFamily: 'UnifrakturCook, serif', fontSize: 40, textAlign: 'center' }}>
        중세 판타지 TRPG에 오신 것을 환영합니다!
      </h1>
      <div style={{ fontSize: 20, margin: '32px 0', minHeight: 180 }}>
        {story.map((line, i) => (
          <div key={i} style={{ marginBottom: 8 }}>{line}</div>
        ))}
      </div>
      <form onSubmit={handleAction} style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
        <input
          type="text"
          value={action}
          onChange={e => setAction(e.target.value)}
          placeholder="당신의 액션을 입력하세요..."
          style={{ flex: 1, padding: 10, borderRadius: 6, border: '1px solid #bfa76f', fontFamily: 'inherit', fontSize: 18 }}
          disabled={pending}
        />
        <button type="submit" disabled={pending || !action.trim()} style={{ padding: '0 18px', background: '#bfa76f', color: '#fff', border: 'none', borderRadius: 6, fontWeight: 'bold', fontFamily: 'inherit', fontSize: 18 }}>
          {pending ? '전송 중...' : '전송'}
        </button>
      </form>
      {error && <div style={{ color: 'crimson', marginBottom: 12 }}>{error}</div>}
      <button onClick={handleLogout} style={{ padding: 10, background: '#bfa76f', color: '#fff', border: 'none', borderRadius: 6, fontWeight: 'bold', fontFamily: 'inherit', fontSize: 18 }}>
        로그아웃
      </button>
    </div>
  );
} 
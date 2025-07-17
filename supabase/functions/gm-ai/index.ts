import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, apikey, x-client-info, x-requested-with'
};
serve(async (req)=>{
  if (req.method === 'OPTIONS') {
    return new Response('', {
      headers: CORS_HEADERS
    });
  }
  try {
    const { action } = await req.json();
    const openaiRes = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: '중세 판타지 TRPG 마스터로서, 사용자의 액션에 대한 결과(한 문장)와 다음 질문(한 문장)을 이런 식으로 객체 형태로 응답해줘, {"result": "몬스터가 쓰러졌다", "nextQuestion": "이제 어디로 갈까요?"}'
          },
          {
            role: 'user',
            content: action
          }
        ],
        max_tokens: 1000
      })
    });
    const data = await openaiRes.json();
    const content = data.choices?.[0]?.message?.content;
    let obj = null;
    try {
      obj = JSON.parse(content);
    } catch  {
      obj = {
        "result": "결과를 알 수 없습니다.",
        "nextQuestion": "다음 행동을 입력하세요."
      };
    }
    return new Response(JSON.stringify(obj), {
      headers: CORS_HEADERS
    });
  } catch (e) {
    return new Response(JSON.stringify({
      error: '서버 오류',
      detail: String(e)
    }), {
      status: 500,
      headers: CORS_HEADERS
    });
  }
});

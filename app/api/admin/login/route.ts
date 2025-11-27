import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const { password } = await req.json();

  const isLocal = process.env.NODE_ENV !== 'production';
  const adminPassword = process.env.ADMIN_PASSWORD;

  // --- Helper: 쿠키 설정 ---
  const setAuthCookie = () => {
    const res = new NextResponse('OK', { status: 200 });
    res.cookies.set({
      name: 'admin-auth',
      value: 'true',
      secure: !isLocal,
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24,
    });
    return res;
  };

  // --- 로컬에서는 패스워드 검사 없이 로그인 통과 ---
  if (isLocal) {
    return setAuthCookie();
  }

  // --- 비밀번호 환경변수 누락 ---
  if (!adminPassword) {
    console.error('[ADMIN ERROR] ADMIN_PASSWORD is not set');
    return NextResponse.json(
      { message: 'Server configuration error' },
      { status: 500 }
    );
  }

  // --- 비밀번호 틀렸을 때 ---
  if (password !== adminPassword) {
    return NextResponse.json(
      { message: 'Invalid password' },
      { status: 401 }
    );
  }

  // --- 로그인 성공 ---
  return setAuthCookie();
}

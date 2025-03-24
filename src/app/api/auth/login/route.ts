import {NextRequest, NextResponse} from 'next/server';

export async function POST(request: NextRequest) {
  try {
    // const {username, password}: { username: string; password: string } = body;
    // const res = await fetch('https://example.com/auth/login', {
    //   method: 'POST',
    //   headers: {'Content-Type': 'application/json'},
    //   body: JSON.stringify({username, password}),
    // });
    //
    // if (!res.ok) {
    //   return NextResponse.json({message: 'Authentication failed'}, {status: 401});
    // }
    //
    // const data = await res.json();
    // const accessToken = data.accessToken;

    // TODO : delete
    const body = await request.text(); // 그냥 문자열로 받음

    const params = new URLSearchParams(body);
    const username = params.get('username');
    const password = params.get('password');
    let redirect = params.get('redirect');

    if (!username || !password)
      throw new Error('Username or Password is empty');
    const accessToken = "test-access-token_" + username;
    // --
    if(redirect) {
      redirect = (new URL(redirect, request.url)).toString();
    }

    const response = NextResponse.redirect(redirect?redirect:request.url, {status: 302});

    response.cookies.set('accessToken', accessToken, {
      secure: true,
      //httpOnly: true, // TODO : local test시에도 https 지원 방법 찾아야 함
      maxAge: 60 * 60,
      sameSite: 'strict'
    });

    return response;
  } catch (error: unknown) {

    return NextResponse.json({
      message: error instanceof Error ? error.message : 'Unknown error',
    }, {status: 400});
  }
}

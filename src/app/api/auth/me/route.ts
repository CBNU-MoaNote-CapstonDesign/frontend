import {NextRequest, NextResponse} from 'next/server';
import {testUser} from '@/__mocks__/data';

export async function GET(request: NextRequest) {
  const accessToken = request.cookies.get('accessToken')?.value;
  console.log(request.cookies);

  if (!accessToken) {
    return NextResponse.json({message: 'Unauthorized', status: 401})
  }

  // TODO : 실제 백엔드 api 호출 구현
  const user = testUser.find((user) => accessToken.split("_")[1] == user.name);
  if (user) {
    return NextResponse.json( {
      uuid: user.uuid,
      name: user.name,
    });
  }
  return NextResponse.json({message:"User not found", status:404});
}
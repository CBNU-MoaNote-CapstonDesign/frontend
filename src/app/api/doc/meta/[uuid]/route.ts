import {NextRequest, NextResponse} from 'next/server';
import {testData} from '@/__mocks__/data';

export async function GET(request: NextRequest, {params}: { params: { uuid: string } }) {
  const {uuid} = params;

  const accessToken = request.cookies.get('accessToken')?.value;

  if (!accessToken) {
    return NextResponse.json({message: 'Unauthorized', status: 401})
  }

  // TODO : 실제 백엔드 api 호출 구현
  const document = testData.find((text) => text.uuid == uuid);

  return NextResponse.json(document);
}
// app/api/mermaid/route.ts
import { NextRequest, NextResponse } from 'next/server'

// 메모리 저장소
const memoryStore = new Map<string, string>()

// POST: { id, syntax } 저장
export async function POST(req: NextRequest) {
  const body = await req.json()
  const id = body.id
  const syntax = body.syntax

  if (!id || typeof id !== 'string') {
    return NextResponse.json({ error: 'Missing or invalid id' }, { status: 400 })
  }

  if (!syntax || typeof syntax !== 'string') {
    return NextResponse.json({ error: 'Missing or invalid syntax' }, { status: 400 })
  }

  memoryStore.set(id, syntax)

  return NextResponse.json({ message: 'Saved successfully', id }, { status: 200 })
}

// GET: /api/mermaid?id=uuid → syntax 반환
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const id = searchParams.get('id')

  if (!id) {
    return NextResponse.json({ error: 'Missing id' }, { status: 400 })
  }

  const syntax = memoryStore.get(id)

  if (!syntax) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  return NextResponse.json({ "mermaid" : syntax }, { status: 200 })
}

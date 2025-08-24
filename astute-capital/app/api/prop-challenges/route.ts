import { NextResponse } from "next/server"

export let challenges: any[] = []

export async function GET() {
	return NextResponse.json({ challenges })
}

export async function POST(request: Request) {
	const body = await request.json()
	const id = Date.now().toString()
	const challenge = { id, ...body }
	challenges.push(challenge)
	return NextResponse.json({ challenge }, { status: 201 })
}
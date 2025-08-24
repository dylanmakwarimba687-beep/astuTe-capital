import { NextResponse } from "next/server"

// NOTE: This relies on Node module caching to share the array from the parent route file during dev.
// For a real app, replace with a database.
let challengesRef: any[] | null = null

// Lazy import to access the same module instance as /api/prop-challenges
async function getStore() {
	if (!challengesRef) {
		const mod = await import("../route")
		// @ts-ignore - reading module-local variable from parent file
		challengesRef = (mod as any).challenges || []
	}
	return challengesRef
}

export async function PUT(_req: Request, { params }: { params: { id: string } }) {
	const challenges = await getStore()
	const idx = challenges.findIndex((c) => c.id === params.id)
	if (idx === -1) return NextResponse.json({ error: "Not found" }, { status: 404 })
	const body = await _req.json()
	challenges[idx] = { ...challenges[idx], ...body }
	return NextResponse.json({ challenge: challenges[idx] })
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
	const challenges = await getStore()
	const idx = challenges.findIndex((c) => c.id === params.id)
	if (idx === -1) return NextResponse.json({ error: "Not found" }, { status: 404 })
	const [removed] = challenges.splice(idx, 1)
	return NextResponse.json({ challenge: removed })
}
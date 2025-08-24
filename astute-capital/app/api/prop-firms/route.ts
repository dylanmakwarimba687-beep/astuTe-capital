import { NextResponse } from "next/server"

const propFirms = [
	{ id: "ftmo", name: "FTMO", accountSizes: [10000, 50000, 100000], profitSplit: 80 },
	{ id: "mff", name: "MyForexFunds", accountSizes: [5000, 50000, 200000], profitSplit: 85 },
	{ id: "the5", name: "The5%ers", accountSizes: [5000, 10000, 50000], profitSplit: 100 },
]

export async function GET() {
	return NextResponse.json({ propFirms })
}